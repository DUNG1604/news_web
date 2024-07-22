const LoginRouter = require("./UserRouter")

const router = (app) =>{
    app.use("/user", LoginRouter );
  }
  
module.exports = router;