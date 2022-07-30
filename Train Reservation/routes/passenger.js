const passengerRouter = require("express").Router()
const passengerController = require("../controllers/passenger")


passengerRouter.get("/",passengerController.selectpassengers)
passengerRouter.post("/",passengerController.addpassenger)
passengerRouter.post("/login",passengerController.login)


module.exports = passengerRouter