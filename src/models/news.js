const { DataTypes, INTEGER } = require('sequelize');
const { sequelize } = require("../helpers/ConnectDB");
const User = require('./user');

const News = sequelize.define('News', {
  id: {
    // type: DataTypes.UUID,
    // defaultValue: DataTypes.UUIDV4,
    type: DataTypes.INTEGER,
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
  }
//   ,
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: User,
//       key: 'id'
//     }
//   }
// }, {
//   tableName: 'news',
//   timestamps: false
// }
}
);

// User.hasMany(News, { foreignKey: 'userId' });
// News.belongsTo(User, { foreignKey: 'userId' });

module.exports = News;