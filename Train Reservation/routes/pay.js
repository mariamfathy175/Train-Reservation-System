const payRouter = require("express").Router()
const payController = require("../controllers/pay")
const middlewares = require("../util/middlewares.js")

payRouter.get("/",middlewares.checkAdminAuth,payController.selectpay)
payRouter.post("/",middlewares.checkPassangerAuth,payController.addpay)

module.exports = payRouter