const express = require("express");

const authRouter = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    authRateLimiter
} = require("../middlewares/rateLimit.middleware");

authRouter.post(
    "/register",
    authRateLimiter,
    authController.registerUserController
);

authRouter.post(
    "/login",
    authRateLimiter,
    authController.loginUserController
);

authRouter.get(
    "/logout",
    authController.logoutUserController
);

authRouter.get(
    "/get-me",
    authMiddleware.authUser,
    authController.getMeController
);

module.exports = authRouter;