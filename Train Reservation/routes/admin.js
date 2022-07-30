const adminRouter = require("express").Router()
const adminController = require("../controllers/admin")

adminRouter.get("/",adminController.selectadmins)
adminRouter.post("/",adminController.addadmin)
adminRouter.post("/login",adminController.login)

module.exports = adminRouter