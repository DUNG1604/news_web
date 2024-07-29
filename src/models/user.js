const { DataTypes } = require('sequelize');
const {sequelize} = require("../helpers/ConnectDB")

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;