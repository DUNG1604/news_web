const { DataTypes } = require('sequelize');
const { sequelize } = require("../helpers/ConnectDB");
const User = require('./user');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'news',
  timestamps: false // Nếu bạn không muốn Sequelize tự động thêm `createdAt` và `updatedAt`
});

// Thiết lập quan hệ
User.hasMany(News, { foreignKey: 'userId' });
News.belongsTo(User, { foreignKey: 'userId' });

module.exports = News;
