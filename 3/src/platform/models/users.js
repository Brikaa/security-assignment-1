const Sequelize = require('sequelize');
const crypto = require('crypto');

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
                async beforeCreate(instance) {
                    instance.created_at = util.now();
                    if (instance.password)
                        instance.password = crypto.createHash('sha1').update(instance.password).digest('hex');
                    instance.email = await encryption.encrypt(instance.email);
                },
                async beforeUpdate(instance) {
                    if (instance.changed('password'))
                        instance.password = crypto.createHash('sha1').update(instance.password).digest('hex');
                    if (instance.changed('email')) instance.email = await encryption.encrypt(instance.email);
                },
                afterFind(instances) {
                    return util.update_instances(instances, async (instance) => {
                        instance.email = await encryption.decrypt(instance.email);
                    });
                }

            }
        }
    );

    return users;
};
