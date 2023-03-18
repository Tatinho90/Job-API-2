const User = require("../models/User")
const {StatusCodes} = require("http-status-codes")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {BadRequestError, UnauthenticatedError} = require("../errors/index")

const register = async (req, res) => {
     //encrypting the password before passing it to db => replace this to working from mongoose middleware
// const {name, email, password} = req.body
// const salt = await bcryptjs.genSalt(10)
// const hashPassword = await bcryptjs.hash(password, salt)

// const tempUser = {name, email, password:hashPassword}

    const user = await User.create({...req.body})
    //This was replaced by an instance method
// const token = jwt.sign({userID:user._id, name: user.name}, "JwtSecret", {
//     expiresIn: "30d"
// })
 const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({user: {name: user.name, id:user._id }, token})
}

const login = async (req, res) => {
    const{email, password} = req.body
    console.log("this was called")

    if(!email || !password){
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({email})
    
    if(!user){
        throw new UnauthenticatedError("User doesn't exist")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Incorrect passowrd")
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {register, login}