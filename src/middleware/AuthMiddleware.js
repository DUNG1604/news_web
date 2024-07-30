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
      console.log("da xac thuc", req.jwtDecoded);
      next();
    } catch (error) {
      return res.status(403).send({
        message: "token bị sửa",
      });
    }
  } else {
    return res.status(403).send({
      message: "k có token",
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
    res.cookie("accessToken", "", { expires: new Date(0), httpOnly: true });
    res.cookie("refreshToken", "", { expires: new Date(0), httpOnly: true });
    res.redirect("/login");
  }
};

module.exports = {
  isAuth: isAuth,
  isAdmin: isAdmin,
};
