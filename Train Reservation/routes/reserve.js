const reserveRouter = require("express").Router()
const reserveController = require("../controllers/reserve")
const middlewares = require("../util/middlewares.js")

reserveRouter.get("/",middlewares.checkPassangerAuth,reserveController.selectreservations)
reserveRouter.get("/tickets",middlewares.checkAdminAuth,reserveController.selectTicket)
reserveRouter.get("/ticket",middlewares.checkPassangerAuth,reserveController.selectmyTicket)
reserveRouter.post("/",middlewares.checkPassangerAuth,reserveController.addreservation)
reserveRouter.put("/:id",middlewares.checkPassangerAuth,reserveController.updatereservation)
reserveRouter.delete("/:id",middlewares.checkPassangerAuth,reserveController.deletereservation)
reserveRouter.patch("/:id",middlewares.checkPassangerAuth,reserveController.restorereservation)

module.exports = reserveRouter
