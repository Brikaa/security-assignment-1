const Sequelize = require('sequelize');

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
                async beforeCreate(instance) {
                    instance.created_at = util.now();
                    instance.solution = await encryption.encrypt(instance.solution);
                },
                async beforeUpdate(instance) {
                    if (instance.changed('solution')) instance.solution = await encryption.encrypt(instance.solution);
                },
                afterFind(instances) {
                    console.log({instances});
                    return util.update_instances(instances, async (instance) => {
                        instance.solution = await encryption.decrypt(instance.solution);
                    });
                }
            }
        }
    );
    return user_challenges;
};
