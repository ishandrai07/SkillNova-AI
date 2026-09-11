const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/*using all the routes here*/ 
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handler — must have 4 params so Express treats it as error middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
})

module.exports = app