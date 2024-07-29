const express = require("express");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();
// router.get("/home",UserController.Home);
// router.post("/register", UserController.postRegister);
// router.get("/register", UserController.Register);
// router.post("/login", UserController.postLogin);
// router.get("/login", UserController.Login);
router.use(AuthMiddleware.isAuth);
router.use("/show", UserController.Show);
router.get("/admin",AuthMiddleware.isAdmin ,UserController.Admin);

module.exports = router;
