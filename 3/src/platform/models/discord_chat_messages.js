const Sequelize = require('sequelize');
const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
    class discord_chat_messages extends Sequelize.Model {}

    discord_chat_messages.init(
        {
            discord_chat_message_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            hash: DataTypes.STRING,
            channel: DataTypes.STRING,
            user: DataTypes.STRING,
            discord_id: DataTypes.STRING,
            message: DataTypes.STRING,
            created_at: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'discord_chat_messages',
            freezeTableName: true,
            hooks: {
                beforeCreate(instance) {
                    instance.created_at = util.now();
                    encryptMsg(instance);
                },
                beforeUpdate(instance){
                    if(instance.changed('message'))
                        encryptMsg(instance);
                },
                afterFind(instances) {
                    if (instances) {
                        if (Array.isArray(instances)) {
                            Promise.all(instances.map((instance) => {
                                decryptMsg(instance);
                            }));
                        } else {
                            decryptMsg(instances);
                        }
                    }
                }
            }
        }
    );

    function encryptMsg(instance) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.message) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.message);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.message = encrypted.toString();
        }
    }

    function decryptMsg(instance){
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.message) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.message, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.message = decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
    return discord_chat_messages;
};
