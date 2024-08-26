const { DataTypes } = require('sequelize');
const { sequelize } = require("../helpers/ConnectDB");
const User = require('./user');
const News = require('./news');

const NewsHistory = sequelize.define('NewsHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  newsId: {
    type: DataTypes.UUID,
    references: {
      model: News,
      key: 'id',
    },
  },
  readAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'news_history',
  timestamps: false,
});

// Thiết lập quan hệ
User.hasMany(NewsHistory, { foreignKey: 'userId' });
NewsHistory.belongsTo(User, { foreignKey: 'userId' });

News.hasMany(NewsHistory, { foreignKey: 'newsId' });
NewsHistory.belongsTo(News, { foreignKey: 'newsId' });

module.exports = NewsHistory;
