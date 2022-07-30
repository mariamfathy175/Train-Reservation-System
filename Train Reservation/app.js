const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const bodyparser = require("body-parser")

const conn = require("./db/connection")

const adminRouter = require("./routes/admin")
const passengerRouter = require("./routes/passenger")
const tripRouter = require("./routes/trip")
const trainRouter = require("./routes/train")
const paymentRouter = require("./routes/payment")
const reserveRouter = require("./routes/reserve")
const payRouter = require("./routes/pay")

app.use(morgan("dev"))
app.use(cors())
app.use(bodyparser.urlencoded({
    extended:false
}))
app.use(bodyparser.json())

const knex = conn.openConnection()
app.locals.knex = knex

app.use("/admin",adminRouter)
app.use("/passenger" , passengerRouter)
app.use("/trip",tripRouter)
app.use("/train",trainRouter)
app.use("/payment",paymentRouter)
app.use("/reserve",reserveRouter)
app.use("/pay",payRouter)

app.use((req, res, next) => {

    const error = new Error("Page not Found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        res.status(404).json({
            status: "error",
            msg: "Page not Found"
        })
    }else {
        console.log(error);
        res.status(500).json({
            status:"error",
            msg:"500 internal server error"
        })
    }
})

module.exports = app
