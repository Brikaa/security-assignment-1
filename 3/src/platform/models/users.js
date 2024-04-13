const Sequelize = require('sequelize');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
    class users extends Sequelize.Model {}

    users.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            is_superuser: DataTypes.INTEGER,
            is_contest_author: DataTypes.INTEGER,
            is_challenge_author: DataTypes.INTEGER,
            display_name: DataTypes.STRING,
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            discord_api: DataTypes.STRING,
            discord_rank: DataTypes.INTEGER,
            avatar_url: DataTypes.STRING,
            score: DataTypes.INTEGER,
            created_at: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'users',
            freezeTableName: true,
            hooks: {
                beforeCreate(instance) {
                    instance.created_at = util.now();

                    if (instance.password)
                        instance.password = crypto
                            .createHash('sha1')
                            .update(instance.password)
                            .digest('hex');
                    encryptEmail(instance);
                },

                beforeUpdate(instance) {
                    if (instance.changed('password'))
                        instance.password = crypto
                            .createHash('sha1')
                            .update(instance.password)
                            .digest('hex');
                    if (instance.changed('email'))
                        encryptEmail(instance);
                },
                afterFind(instances) {
                    if (instances) {
                        if (Array.isArray(instances)) {
                            Promise.all(instances.map((instance) => {
                                decryptEmail(instance);
                            }));
                        } else {
                            decryptEmail(instances);
                        }
                    }
                }
            }
        }
    );

    function encryptEmail(instance) {
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.email) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const data_array = CryptoJS.enc.Utf8.parse(instance.email);
            const encrypted = CryptoJS.AES.encrypt(data_array, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.email = encrypted.toString();
        }
    }

    function decryptEmail(instance){
        const encryption_key = process.env.ENCRYPTION_KEY;
        if (encryption_key && instance.email) {
            const key_array = CryptoJS.enc.Utf8.parse(encryption_key);
            const decrypted = CryptoJS.AES.decrypt(instance.email, key_array, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            instance.email = decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
    return users;
};
