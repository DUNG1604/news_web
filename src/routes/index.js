const LoginRouter = require("./UserRouter");
const AdminRouter = require("./AdminRouter");
const UserController = require("../controllers/UserController")

const router = (app) => {
  app.post("/register", UserController.postRegister);
  app.get("/register", UserController.Register);
  app.post("/login", UserController.postLogin);
  app.get("/login", UserController.Login);
  app.use("/user", LoginRouter);
  app.use("/admin", AdminRouter);
  app.get("/", UserController.Home);
};

module.exports = router;
