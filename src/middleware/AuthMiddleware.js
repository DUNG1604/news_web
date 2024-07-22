const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.cookies.accessToken;
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      req.jwtDecoded = decoded;
      console.log("da xac thuc",req.jwtDecoded)
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

let isAdmin = async(req, res, next) => {
  const tokenFromClient = req.cookies.accessToken;
  const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
  req.jwtDecoded = decoded;
  if (req.jwtDecoded.data.role !== 'admin') {
    return res.status(403).json({
      message: 'Forbidden: Admins only.',
    });
  }
  next();
};

module.exports = {
  isAuth: isAuth,
  isAdmin: isAdmin
};
