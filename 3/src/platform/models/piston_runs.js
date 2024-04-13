const Sequelize = require('sequelize');
const CryptoJS = require('crypto-js');
module.exports = (sequelize, DataTypes) => {
    class piston_runs extends Sequelize.Model {}

    piston_runs.init(
        {
            piston_run_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            server: DataTypes.STRING,
            server_id: DataTypes.STRING,
            user: DataTypes.STRING,
            user_id: DataTypes.STRING,
            language: DataTypes.STRING,
            source: DataTypes.TEXT,
            created_at: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'piston_runs',
            freezeTableName: true,
            hooks: {
                beforeCreate(instance) {
                    instance.created_at = util.now();
                    encryptSource(instance);
                },
                beforeUpdate(instance){
                    if(instance.changed('source'))
                        encryptSource(instance);
                },
                afterFind(instances) {
                    if (instances) {
                        if (Array.isArray(instances)) {
                            Promise.all(instances.map((instance) => {
                                decryptSource(instance);
                            }));
                        } else {
                            decryptSource(instances);
                        }
                    }
                }
            }
        }
    );


    function encryptSource(instance) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.source) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.source);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.source = encrypted.toString();
        }
    }

    function decryptSource(instance){
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.source) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.source, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.source = decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
    return piston_runs;
};
