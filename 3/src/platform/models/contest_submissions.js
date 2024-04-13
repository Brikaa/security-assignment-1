const Sequelize = require('sequelize');
const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
    class contest_submissions extends Sequelize.Model {}

    contest_submissions.init(
        {
            contest_submission_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.INTEGER,
            contest_id: DataTypes.INTEGER,
            language: DataTypes.STRING,
            language_version: DataTypes.STRING,
            solution: DataTypes.TEXT('medium'),
            length: DataTypes.INTEGER,
            length_best: DataTypes.INTEGER,
            explanation: DataTypes.TEXT('medium'),
            award_place: DataTypes.INTEGER,
            award_points: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            late: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'contest_submissions',
            freezeTableName: true,
            hooks: {
                beforeCreate(instance) {
                    instance.created_at = util.now();
                    encrypt(instance, false, false, true);
                },
                beforeUpdate(instance){
                    if(instance.changed('solution'))
                        encrypt(instance, true, false, false);
                    if(instance.changed('explanation'))
                        encrypt(instance, false, true, false);
                },
                afterFind(instances) {
                    if (instances) {
                        if (Array.isArray(instances)) {
                            Promise.all(instances.map((instance) => {
                                decrypt(instance);
                            }));
                        } else {
                            decrypt(instances);
                        }
                    }
                }
            }
        }
    );


    function encrypt(instance, solutionChanged, explanationChanged, newlyCreated) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.solution && (solutionChanged || newlyCreated)) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.solution);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.solution = encrypted.toString();
        }
        if (encryption_key && instance.explanation && (explanationChanged || newlyCreated)) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.explanation);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.explanation = encrypted.toString();
        }
    }

    function decrypt(instance) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.solution) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.solution, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.solution = decrypted.toString(CryptoJS.enc.Utf8);
        }
        if (encryption_key && instance.explanation) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.explanation, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.explanation = decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
    return contest_submissions;
};
