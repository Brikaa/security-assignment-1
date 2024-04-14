const Sequelize = require('sequelize');

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
                async beforeCreate(instance) {
                    instance.created_at = util.now();
                    instance.solution = await encryption.encrypt(instance.solution);
                    instance.explanation = await encryption.encrypt(instance.explanation);
                },
                async beforeUpdate(instance) {
                    if (instance.changed('solution')) instance.solution = await encryption.encrypt(instance.solution);
                    if (instance.changed('explanation'))
                        instance.explanation = await encryption.encrypt(instance.explanation);
                },
                afterFind(instances) {
                    return util.update_instances(instances, async (instance) => {
                        instance.solution = await encryption.decrypt(instance.solution);
                        instance.explanation = await encryption.decrypt(instance.explanation);
                    });
                }
            }
        }
    );
    return contest_submissions;
};
