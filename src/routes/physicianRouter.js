const express = require("express");
const physicianRouter = express.Router();
const physicianController = require("../controllers/physicianController");
const auth = require("../middlewares/auth");

physicianRouter.post("/authentication", physicianController.authentication);
physicianRouter.get("/listAllPhysician", auth, physicianController.listAllPhysician);
physicianRouter.post("/newPhysician", auth, physicianController.newPhysician);
physicianRouter.delete("/deletePhysician/:id", auth, physicianController.deletePhysician);
physicianRouter.put("/updatePhysician/", auth, physicianController.updatePhysician);


module.exports = physicianRouter;
