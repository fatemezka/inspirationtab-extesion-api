const Base = require("./Base");

module.exports = (sequelize, DataTypes) => {
    return Base(sequelize, DataTypes, "image", {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        category: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.STRING(2048), allowNull: false },
    })
}