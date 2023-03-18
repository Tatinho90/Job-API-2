const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
//comment


const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "please provide a name"],
        minlength: 3,
        maxlength: 20
    },
    email : {
        type: String,
        required: [true, "please provide an email"],
        minlength: 3,
        maxlength: 50,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email address"],
        unique: true,
    },
    password : {
        type: String,
        required: [true, "please provide password"],
        minlength: 6,
    }
}
)

//mongoose middleware (recommended to use function instead of arrow function)
userSchema.pre("save", async function(next){
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next()
} )

//Instance method: a method that can be called on each document
userSchema.methods.createJWT = function(){
    return jwt.sign({userID: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model("Users", userSchema )