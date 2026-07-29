const express = require('express')

const authRouter = express.Router() 
const authContoller = require('../controllers/auth.controller')

/**
 * @route POST/api/auth/regiter
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authContoller.registerUserController)

/**
 * @route POST/api/auth/login
 * @description login user with email and password
 * @access Public
 */

authRouter.post("/login", authContoller.loginUserController)


/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get("/logout", authContoller.logoutUserController)

module.exports = authRouter