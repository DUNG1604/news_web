const express = require("express");
const app = express();
const initAPIs = require("./routes/UserRouter");
const expressLayouts = require('express-ejs-layouts');
const router = require("./routes")
const path = require("path");
const { connectDB, sequelize } = require("./helpers/ConnectDB");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.set("view engine", "ejs");
app.set("layout","layouts/layout");
app.set("views", path.join(__dirname, "views"));

connectDB();
sequelize.sync()
  .then(() => {
    console.log('Đã đồng bộ DB');
  })
  .catch(err => {
    console.error('Lỗi đồng bộ BD:', err);
  });

router(app);

let port = 8017;
app.listen(port, () => {
  console.log(`I'm running at localhost:${port}/`);
});
