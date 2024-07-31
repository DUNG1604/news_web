const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.cookies.accessToken;
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      req.jwtDecoded = decoded;
      console.log("Đã xác thực", req.jwtDecoded);
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
            console.log("Đã xác thực sau khi tạo");
            next();
          } catch (error) {
            return res.send("không refresh được");
          }
        }
      } else {
        res.cookie("accessToken", "", { expires: new Date(0), httpOnly: true });
        res.cookie("refreshToken", "", {
          expires: new Date(0),
          // httpOnly: true,
        });
        res.redirect("/login");
      }
    }
  } else {
    return res.status(403).send({
      message: "Không có token",
    });
  }
};

let isAdmin = async (req, res, next) => {
  try {
    const tokenFromClient = req.cookies.accessToken;
    const decoded = await jwtHelper.verifyToken(
      tokenFromClient,
      accessTokenSecret
    );
    req.jwtDecoded = decoded;
    if (req.jwtDecoded.data.role !== "admin") {
      return res.status(403).json({
        message: "Chỉ dành cho admin.",
      });
    }
    next();
  } catch (error) {
    res.cookie("accessToken", "", { expires: new Date(0)});
    res.cookie("refreshToken", "", { expires: new Date(0)});
    res.redirect("/login");
  }
};

module.exports = {
  isAuth: isAuth,
  isAdmin: isAdmin,
};
