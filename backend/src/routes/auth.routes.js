const express = require('express')

const authRouter = express.Router() 
const authContoller = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { authRateLimiter } = require('../middlewares/rateLimit.middleware')
/**
 * @route POST/api/auth/regiter
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authRateLimiter, authContoller.registerUserController)

/**
 * @route POST/api/auth/login
 * @description login user with email and password
 * @access Public
 */

authRouter.post("/login", authRateLimiter, authContoller.loginUserController)


/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get("/logout", authContoller.logoutUserController)

/**
 * @route GET/api/auth/get-me
 * @description gte the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authContoller.getMeController)

module.exports = authRouter