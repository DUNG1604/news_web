const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.cookies.accessToken;
  console.log("token auth ", tokenFromClient);
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      req.jwtDecoded = decoded;
      console.log("Đã xác thực isAuth", req.jwtDecoded);
      next();
    } catch (error) {
      if (error.message === "token hết hạn") {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
          try {
            const refreshTokenSecret =
              process.env.REFRESH_TOKEN_SECRET ||
              "refresh-token-secret-example";
            const accessTokenSecret =
              process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "20s";
            const decode = await jwtHelper.verifyToken(
              refreshToken,
              refreshTokenSecret
            );
            const userData = decode;
            const accessToken = await jwtHelper.generateToken(
              userData.data,
              accessTokenSecret,
              accessTokenLife
            );
            res.cookie("accessToken", accessToken, {
              // httpOnly: true,
              maxAge: 1000 * 60 * 60,
            });
            req.jwtDecoded = userData;
            console.log("đã tạo token mới");
            console.log("Đã xác thực sau khi tạo");
            console.log("data mới isAuth", userData);
            next();
          } catch (error) {
            return res.send("không refresh được");
          }
        }
      } else {
        console.log(error.message);
        return res.status(403).send(error.message);
      }
    }
  } else {
    res.redirect("/login");
  }
};

let isAdmin = async (req, res, next) => {
  console.log("data isAdmin", req.jwtDecoded);
  try {
    // const tokenFromClient = req.cookies.accessToken;
    // const decoded = await jwtHelper.verifyToken(
    //   tokenFromClient,
    //   accessTokenSecret
    // );
    // req.jwtDecoded = decoded;
    console.log("đã xác thực isAdmin: ", req.jwtDecoded.data.role);
    if (req.jwtDecoded.data.role !== "admin") {
      return res.status(403).json({
        message: "Chỉ dành cho admin.",
      });
    }
    next();
  } catch (error) {
    console.log("không phải admin")
    res.cookie("accessToken", "", { expires: new Date(0)});
    res.cookie("refreshToken", "", { expires: new Date(0)});
    res.redirect("/login");
  }
};

let isAuthor = async (req, res, next) => {
  console.log("data isAuthor", req.jwtDecoded);
  try {
    // const tokenFromClient = req.cookies.accessToken;
    // const decoded = await jwtHelper.verifyToken(
    //   tokenFromClient,
    //   accessTokenSecret
    // );
    // req.jwtDecoded = decoded;
    console.log("đã xác thực isAuthor: ", req.jwtDecoded.data.role);
    if (req.jwtDecoded.data.role !== "author") {
      return res.status(403).json({
        message: "Chỉ dành cho author.",
      });
    }
    next();
  } catch (error) {
    console.log("không phải author")
    res.cookie("accessToken", "", { expires: new Date(0)});
    res.cookie("refreshToken", "", { expires: new Date(0)});
    res.redirect("/login");
  }
};

module.exports = {
  isAuth: isAuth,
  isAdmin: isAdmin,
  isAuthor: isAuthor,
};
