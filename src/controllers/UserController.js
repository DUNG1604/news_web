const { where } = require("sequelize");
const jwtHelper = require("../helpers/jwt.helper");
const User = require("../models/user");
const News = require("../models/news");

const LoginController = {
  Show: (req, res) => {
    res.render("show");
  },
  Login: (req, res) => {
    res.render("login", { title: "dung" });
  },

  Register: (req, res) => {
    res.render("register");
  },

  postRegister: async (req, res) => {
    console.log(req.body);
    const { username, password, confirmPassword } = req.body;
    // console.log(username);
    if (password !== confirmPassword) {
      return res.send("mk k khớp");
    }
    try {
      const checkUsername = await User.findOne({where: { username }});
      if (checkUsername) {
        return res.status(400).send("username đã tồn tại");
      }
      const newUser = await User.create({username, password});
      res.redirect("/user/login");
    } catch (error) {
      res.status(500).send("server err");
    }
  },

  postLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: "Tên người dùng k có." });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: "mật khẩu không hợp lệ." });
      }
      const userData = {
        role: user.role,
        username: user.username,
        _id: user._id,
      };
      const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
      const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
      const refreshTokenSecret =
        process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example";
      const accessToken = await jwtHelper.generateToken(
        userData,
        accessTokenSecret,
        accessTokenLife
      );
      const refreshToken = await jwtHelper.generateToken(
        userData,
        refreshTokenSecret,
        refreshTokenLife
      );
      console.log("login oke", { accessToken, refreshToken });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3650,
      });
      return res.redirect("/user/home");
      // return res.status(200).json({accessToken, refreshToken});
    } catch (error) {
      res.status(500).send("server err");
    }
  },
  Admin: (req, res) => {
    res.render("admin");
  },
  Test: (req, res) => {
    const content = req.params.test;
    res.send(`test: ${content}`);
  },
};

module.exports = LoginController;
