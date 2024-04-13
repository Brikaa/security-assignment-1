const Sequelize = require('sequelize');
const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
    class user_challenges extends Sequelize.Model {}

    user_challenges.init(
        {
            user_challenge_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.INTEGER,
            challenge_id: DataTypes.INTEGER,
            language: DataTypes.STRING,
            solution: DataTypes.TEXT('medium'),
            created_at: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'user_challenges',
            freezeTableName: true,
            hooks: {
                beforeCreate(instance) {
                    instance.created_at = util.now();
                    encryptSolution(instance);
                },
                beforeUpdate(instance){
                    if(instance.changed('solution'))
                        encryptSolution(instance);
                },
                afterFind(instances) {
                    if (instances) {
                        if (Array.isArray(instances)) {
                            Promise.all(instances.map((instance) => {
                                decryptSolution(instance);
                            }));
                        } else {
                            decryptSolution(instances);
                        }
                    }
                }
            }
        }
    );


    function encryptSolution(instance) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.solution) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.solution);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.solution = encrypted.toString();
        }
    }

    function decryptSolution(instance){
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.solution) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.solution, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.solution = decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
    return user_challenges;
};
