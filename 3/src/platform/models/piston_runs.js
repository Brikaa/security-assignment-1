const Sequelize = require('sequelize');

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
                async beforeCreate(instance) {
                    instance.created_at = util.now();
                    instance.source = await encryption.encrypt(instance.source);
                },
                async beforeUpdate(instance) {
                    if (instance.changed('source')) instance.source = await encryption.encrypt(instance.source);
                },
                afterFind(instances) {
                    return util.update_instances(instances, async (instance) => {
                        instance.source = await encryption.decrypt(instance.source);
                    });
                }
            }
        }
    );
    return piston_runs;
};
