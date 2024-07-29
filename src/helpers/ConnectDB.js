const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('news_web', 'root', 'Dung2002.', {
  host: 'localhost',
  dialect: 'mysql'
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connect DB thành công');
  } catch (error) {
    console.error('Connect thất bại:', error);
  }
};

module.exports = { sequelize, connectDB };