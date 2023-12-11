const Base = require("./Base");

module.exports = (sequelize, DataTypes) =>
{
	return Base(sequelize, DataTypes, "search", {
		id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
		user_id: { type: DataTypes.INTEGER, allowNull: true },
		query: { type: DataTypes.STRING(2048), allowNull: true },
		ip: { type: DataTypes.STRING, allowNull: true },
	})
}