const { where } = require("sequelize");
const jwtHelper = require("../helpers/jwt.helper");
const User = require("../models/user");
const News = require("../models/news");

const LoginController = {
  Logout: (req, res) => {
    res.cookie("accessToken", "", { expires: new Date(0) });
    res.cookie("refreshToken", "", { expires: new Date(0) });
    res.status(200).json("đã đăng xuất");
  },
  Login: (req, res) => {
    res.render("auth/login");
  },

  Register: (req, res) => {
    res.render("auth/register");
  },

  postRegister: async (req, res) => {
    console.log(req.body);
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("register", {
        error: "Mật khẩu không khớp",
        username,
        password,
        confirmPassword,
      });
    }

    try {
      const checkUsername = await User.findOne({ where: { username } });
      if (checkUsername) {
        return res.render("register", {
          error: "Tên đăng nhập đã tồn tại",
          username,
          password,
          confirmPassword,
        });
      }

      const newUser = await User.create({ username, password });
      res.redirect("/login");
    } catch (error) {
      res.status(500).send("Lỗi server");
    }
  },

  postLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng!" });
      }

      if (user.password !== password) {
        return res
          .status(401)
          .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng!" });
      }
      const userData = {
        role: user.role,
        username: user.username,
        _id: user._id,
      };
      const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "20s";
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
        // httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3650,
      });
      const data = {
        id: user.id,
        username: user.username,
        role: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      res.status(200).json({ message: "Đăng nhập thành công", data });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
  postRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const refreshTokenSecret =
          process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example";
        const accessTokenSecret =
          process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "20s";
        const decode = await jwtHelper.verifyToken(
          refreshToken,
          refreshTokenSecret
        );
        const userData = decode.data;
        const accessToken = await jwtHelper.generateToken(
          userData,
          accessTokenSecret,
          accessTokenLife
        );
        res.cookie("accessToken", accessToken, {
          // httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });
        console.log("đã tạo token mới");
        return res.status(200).json({ accessToken })
      } catch (error) {
        return res.send("không refresh được");
      }
    }
  },
};

module.exports = LoginController;
