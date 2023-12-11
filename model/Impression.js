const Base = require("./Base");

module.exports = (sequelize, DataTypes) => {
    return Base(sequelize, DataTypes, "impression", {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        quote_id: { type: DataTypes.INTEGER, allowNull: true },
        image_id: { type: DataTypes.INTEGER, allowNull: true },
        mantra_id: { type: DataTypes.INTEGER, allowNull: true },
    })
}