const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role
    }
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject({ message: "token hết hạn" });
        }
        return reject({ message: "token không hợp lệ ở verify" });
      }
      resolve(decoded);
    });
  });
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
