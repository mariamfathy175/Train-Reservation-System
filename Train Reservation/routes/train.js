const trainRouter = require("express").Router()
const trainController = require("../controllers/train")
const middelwares = require("../util/middlewares.js")

trainRouter.get("/",middelwares.checkAdminAuth,trainController.selectTrains)
trainRouter.post("/",middelwares.checkAdminAuth,trainController.addTrain)
trainRouter.put("/:id",middelwares.checkAdminAuth,trainController.updateTrain)
trainRouter.delete("/:id",middelwares.checkAdminAuth,trainController.deleteTrain)
trainRouter.patch("/:id", middelwares.checkAdminAuth,trainController.restoreTrain )

module.exports = trainRouter