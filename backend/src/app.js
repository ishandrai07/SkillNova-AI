const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())

const clientUrl = process.env.CLIENT_URL
const allowedOrigins = [
    clientUrl,
    clientUrl ? clientUrl.replace(/\/$/, "") : null,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (
            allowedOrigins.length === 0 ||
            allowedOrigins.includes(origin) ||
            allowedOrigins.includes(origin.replace(/\/$/, "")) ||
            origin.endsWith(".vercel.app")
        ) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
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