/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/routes/api.js
 */
const express = require("express");
// const AuthMiddleWare = require("../middleware/AuthMiddleware");
// const AuthController = require("../helpers/AuthController");
// const FriendController = require("../controllers/FriendController");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
// let initAPIs = (app) => {
//   router.post("/login", AuthController.login);
//   router.post("/refresh-token", AuthController.refreshToken);

//   // Sử dụng authMiddleware.isAuth trước những api cần xác thực
//   router.use(AuthMiddleWare.isAuth);
//   // List Protect APIs:
//   router.get("/friends", FriendController.friendLists);

//   router.get("/example-protect-api", ExampleController.someAction);

// };
const router = express.Router();
router.get("/home",UserController.Home);
router.post("/register", UserController.postRegister);
router.get("/register", UserController.Register);
router.post("/login", UserController.postLogin);
router.get("/login", UserController.Login);
router.use(AuthMiddleware.isAuth);
router.use("/show", UserController.Show);
router.get("/admin",AuthMiddleware.isAdmin ,UserController.Admin);

module.exports = router;
