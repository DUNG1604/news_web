const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            require:true,
            unique: true
        },
        password:{
            type: String,
            require:true,
        },
        createAt:{
            type: Date,
            default: Date.now
        },
        role:{
            type: String,
            require: true,
            default: "user"
        }
    }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
