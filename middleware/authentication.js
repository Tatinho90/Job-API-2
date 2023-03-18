const {UnauthenticatedError} = require("../errors/index");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

const auth= async(req, res, next) => {
 const authHeader = req.headers.authorization 
 
 if (!authHeader || !authHeader.startsWith("Bearer")){
    throw new UnauthenticatedError('Authentication invalid 1')
 }
const token = authHeader.split(" ")[1]

try{
const payload = jwt.verify(token, process.env.JWT_SECRET)
req.user= {userId : payload.userID, name: payload.name }
next()
}
catch(error){
    throw new UnauthenticatedError(`Authentication invalid 2 ${token}` )
}

}

module.exports = auth