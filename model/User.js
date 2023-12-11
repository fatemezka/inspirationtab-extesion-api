const Base = require("./Base");

module.exports = (sequelize, DataTypes) => {
    return Base(sequelize, DataTypes, "user", {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        e_otp: { type: DataTypes.STRING(6), allowNull: true, secure: true },
        e_otp_time: { type: 'TIMESTAMP', allowNull: true, defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), secure: true },
        e_otp_attempt: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false, secure: true },
        e_try_attempt: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false, secure: true },
        e_approved: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false, secure: true },
        new_password: { type: DataTypes.STRING, allowNull: true, secure: true },
        newsletter: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    })
}