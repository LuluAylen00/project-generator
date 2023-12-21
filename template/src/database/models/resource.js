module.exports = (sequelize, DataTypes) => {
    let alias = "Resources";

    let cols = {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    };

    let config = {
        tableName: "resources",
        timestamps: false, // CREATED_AT UPDATED_AT DELETED_AT
    };

    const Resources = sequelize.define(alias, cols, config);

    Resources.associate = function(models){
        // Resources.hasMany(models.OtherOne, { 
        //     as: "Alias",
        //     foreignKey: "foreign_key",
        // })

        // Resources.belongsTo(models.OtherOne, { 
        //     as: "Alias",
        //     foreignKey: "foreign_key",
        // })
        
        // Resources.belongsToMany(models.OtherOne, { 
        //     as: "Alias",
        //     foreignKey: "foreign_key",
        //     otherKey: "other_key",
        //     through: 'through',
        //     timestamps: false 
        // })
    }

    return Resources;
}