const LoginRouter = require("./UserRouter");
const AdminRouter = require("./AdminRouter");
const UserController = require("../controllers/UserController");
const NewsController = require("../controllers/NewsController");
const MainController = require("../controllers/MainController");

const router = (app) => {
  app.post("/register", UserController.postRegister);
  app.get("/register", UserController.Register);
  app.post("/login", UserController.postLogin);
  app.get("/login", UserController.Login);
  app.use("/user", LoginRouter);
  app.use("/admin", AdminRouter);
  app.get("/:id", NewsController.DetailUser);
  app.get("/", MainController.Home);
};

module.exports = router;
