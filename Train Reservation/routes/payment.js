const paymentRouter = require("express").Router()
const paymentController = require("../controllers/payment")
const middlewares = require("../util/middlewares.js")

paymentRouter.get("/",middlewares.checkAdminAuth,paymentController.selectpayments)
paymentRouter.post("/",middlewares.checkPassangerAuth,paymentController.addpayment)
paymentRouter.put("/:id",middlewares.checkPassangerAuth,paymentController.updatepayment)
paymentRouter.delete("/:id",middlewares.checkPassangerAuth,paymentController.deletepayment)
paymentRouter.patch("/:id",middlewares.checkPassangerAuth,paymentController.restorepayment)

module.exports = paymentRouter