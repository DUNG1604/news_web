const { where } = require("sequelize");
const jwtHelper = require("../helpers/jwt.helper");
const User = require("../models/user");
const News = require("../models/news");

const LoginController = {
  Show: (req, res) => {
    res.render("show");
  },
<<<<<<< HEAD
  Home: async(req, res) => {
    // const cards = Array(8).fill({
    //   img: 'https://via.placeholder.com/150',
    //   title: 'Card title',
    //   text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
    //   link: '#'
    // });
    const cards = await News.findAll();
    res.render("home",{ cards });
  },
=======
>>>>>>> 0ccac9ba196191b00afdacc130861567a13424ed
  Login: (req, res) => {
    res.render("login", { title: "dung" });
  },

  Register: (req, res) => {
    res.render("register");
  },

  postRegister: async (req, res) => {
    console.log(req.body);
    const { username, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.render('register', {
        error: "Mật khẩu không khớp",
        username,
        password,
        confirmPassword
      });
    }
  
    try {
<<<<<<< HEAD
      const checkUsername = await User.findOne({where: { username }});
=======
      const checkUsername = await User.findOne({ where: { username } });
>>>>>>> 0ccac9ba196191b00afdacc130861567a13424ed
      if (checkUsername) {
        return res.render('register', {
          error: "Tên đăng nhập đã tồn tại",
          username,
          password,
          confirmPassword
        });
      }
<<<<<<< HEAD
      const newUser = await User.create({username, password});
      res.redirect("/user/login");
=======
  
      const newUser = await User.create({ username, password });
      res.redirect("/login");
>>>>>>> 0ccac9ba196191b00afdacc130861567a13424ed
    } catch (error) {
      res.status(500).send("Lỗi server");
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
      // localStorage.setItem("username", user.username);
      return res.redirect("/");
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
