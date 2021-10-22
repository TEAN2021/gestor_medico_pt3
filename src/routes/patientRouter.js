const express = require("express");
const patientRouter = express.Router();
const patientController = require("../controllers/patientController");
const auth = require("../middlewares/auth");

patientRouter.post("/searchPatientByName", auth, patientController.searchPatientByName);

patientRouter.post("/newPatient", auth, patientController.newPatient);

patientRouter.put("/updatePatient/", auth, patientController.updatePatient);

patientRouter.post("/searchPatientByPhysicianId/:physicianId",  auth, patientController.searchPatientByPhysicianId);

module.exports = patientRouter;
