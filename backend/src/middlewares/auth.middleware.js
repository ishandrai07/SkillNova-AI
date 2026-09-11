const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")



async function authUser(req, res, next){
    let token = req.cookies?.token

    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]
        } else {
            token = authHeader
        }
    }

    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }

    const isTokenBlackListed = await tokenBlackListModel.findOne({
        token
    })

    if(isTokenBlackListed){
        return res.status(401).json({
            message:"token is invalid"
        })
    }


    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token."
        })
    }
   
}

module.exports = {authUser}