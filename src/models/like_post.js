const { DataTypes } = require('sequelize');
const { sequelize } = require("../helpers/ConnectDB");
const User = require('./user');
const News = require('./news');

const Like = sequelize.define('Like', {
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
  likedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'likes',
  timestamps: false,
});

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

News.hasMany(Like, { foreignKey: 'newsId' });
Like.belongsTo(News, { foreignKey: 'newsId' });

module.exports = Like;
