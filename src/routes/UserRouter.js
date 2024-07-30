const express = require("express");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();
router.use(AuthMiddleware.isAuth);

module.exports = router;
