const express = require('express')

const authRouter = express.Router() 
const authContoller = require('../controllers/auth.controller')

/**
 * @route POST/api/auth/regiter
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authContoller.registerUserController)

module.exports = authRouter