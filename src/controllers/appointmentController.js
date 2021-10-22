const Appointment = require("../models/Appointment");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  async newAppointment(req, res) {
    const { appointmentDate, description, patientId, physicianId } = req.body;
    if (!appointmentDate || !description || !patientId || !physicianId) {
      res.status(400).json({
        msg: "Dados obrigatorios nao foram preenchidos.",
      });
    }

    //Rever regra de validacao da consulta (paciente horario) e (medico horario)
    const patientAlreadyHasAppointment = await Appointment.findOne({
      where: {
        appointmentDate,
        patientId,
      },
    });

    const isPhysicianAvaliable = await Appointment.findOne({
      where: {
        appointmentDate,
        physicianId,
      },
    });
    console.log(isPhysicianAvaliable && patientAlreadyHasAppointment);
    if (isPhysicianAvaliable && patientAlreadyHasAppointment)
      res.status(403).json({ msg: "Consulta ja foi cadastrado." });
    else {
      const appointment = await Appointment.create({
        appointmentDate,
        description,
        patientId,
        physicianId,
      }).catch((error) => {
        res.status(500).json({ msg: "Nao foi possivel inserir os dados." });
      });
      if (appointment)
        res.status(201).json({ msg: "Nova consulta foi adicionado" });
      else
        res
          .status(404)
          .json({ msg: "Nao foi possivel cadastrar nova consulta" });
    }
  },
  async deleteAppointment(req, res) {
    const appointmentId = req.params.id;
    const deletedAppointment = await Appointment.destroy({
      where: { id: appointmentId },
    });
    if (deletedAppointment != 0) {
      res.status(200).json({ msg: "Consulta excluida com sucesso." });
    } else res.status(404).json({ msg: "Consulta nao encontrada." });
  },
  async searchAppointmentByPatientId(req, res) {
    const patientId = req.params.patientId;
    if (!patientId)
      res.status(400).json({
        msg: "Campo paciente vazio",
      });

    const appointment = await Appointment.findAll({
      where: { patientId },
    }).catch((error) => res.status(500).json({ msg: "Falha na conexao" }));

    if (appointment) {
      if (appointment == "")
        res.status(404).json({ msg: "Nao ha consultas para este paciente." });
      else res.status(200).json({ appointment });
    } else
      res.status(404).json({ msg: "Nao foi possivel encontrar consultas" });
  },
  async searchAppointmentByPhysicianId(req, res) {
    const physicianId = req.params.physicianId;
    if (!physicianId)
      res.status(400).json({
        msg: "Campo medico vazio",
      });

    const appointment = await Appointment.findAll({
      where: { physicianId },
    }).catch((error) => res.status(500).json({ msg: "Falha na conexao" }));

    if (appointment) {
      if (appointment == "")
        res.status(404).json({ msg: "Nao ha consultas para este medico." });
      else res.status(200).json({ appointment });
    } else
      res.status(404).json({ msg: "Nao foi possivel encontrar consultas" });
  },
};
