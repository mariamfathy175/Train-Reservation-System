const tripRouter = require("express").Router()
const tripController = require("../controllers/trip")
const middelwares = require("../util/middlewares.js")

tripRouter.get("/",tripController.selecttrip)
tripRouter.get("/Tripdetails",tripController.Tripdetails)
tripRouter.post("/",middelwares.checkAdminAuth,tripController.addtrip)
tripRouter.put("/:id",middelwares.checkAdminAuth,tripController.updateTrip)
tripRouter.delete("/:id",middelwares.checkAdminAuth,tripController.deleteTrip)
tripRouter.patch("/:id", middelwares.checkAdminAuth,tripController.restoreTrip )


module.exports = tripRouter