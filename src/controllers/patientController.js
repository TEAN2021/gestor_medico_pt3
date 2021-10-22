const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Sequelize = require("sequelize");

module.exports = {
  async searchPatientByName(req, res) {
    const name = req.body.name;
    if (!name)
      res.status(400).json({
        msg: "Parametro nome esta vazio.",
      });
    const Op = Sequelize.Op;
    const patient = await Patient.findAll({
      where: { name: { [Op.like]: "%" + name + "%" } },
    }).catch((error) => {
      res.status(500).json({ msg: "Falha na conexao. " });
    });

    if (patient) {
      if (patient === "")
        res.status(404).json({ msg: "Paciente nao encontrado" });
      else res.status(200).json({ patient });
    } else
      res.status(404).json({
        msg: "Paciente nao encontrado",
      });
  },
  async searchPatientByPhysicianId(req, res) {
    const physicianId = req.params.physicianId;
    if (!physicianId)
      res.status(400).json({
        msg: "Campo medico vazio",
      });

    const patients = await Appointment.findAll({
      attributes: ["patientId"],
      where: { physicianId },
      raw: true,
      include: [
        {
          model: Patient,
          required: true,
          attributes: ["name", "phone", "email"],
        },
      ],
    }).catch((error) => res.status(500).json({ msg: "Falha na conexao" }));

    const obj = patients;
    console.log(obj);
    if (patients) {
      if (patients == "")
        res.status(404).json({ msg: "Nao ha pacientes para este medico." });
      else {
        res.status(200).json({ patients });
      }
    } else
      res.status(404).json({ msg: "Nao foi possivel encontrar pacientes" });
  },

  async newPatient(req, res) {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({
        msg: "Dados obrigatorios nao foram preenchidos.",
      });
    }

    const isPatientNew = await Patient.findOne({
      where: { email },
    });
    if (isPatientNew)
      res.status(403).json({ msg: "Paciente ja foi cadastrado." });
    else {
      const patient = await Patient.create({
        name,
        email,
        phone,
      }).catch((error) => {
        res.status(500).json({ msg: "Nao foi possivel inserir os dados." });
      });
      if (patient)
        res.status(201).json({ msg: "Novo paciente foi adicionado" });
      else
        res
          .status(404)
          .json({ msg: "Nao foi possivel cadastrar novo paciente" });
    }
  },
  async updatePatient(req, res) {
    const patientId = req.body.id;
    const patient = req.body;
    if (!patientId) res.status(404).json({ msg: "ID do paciente vazio. " });
    else {
      const patientExists = await Patient.findByPk(patientId);
      if (!patientExists)
        res.status(404).json({ msg: "Paciente nao encontrado. " });
      else {
        if (patient.name || patient.email || patient.phone) {
          await Patient.update(patient, {
            where: { id: patientId },
          });
          return res
            .status(200)
            .json({ msg: "Paciente atualizado com sucesso" });
        } else
          return res
            .status(400)
            .json({ msg: "Campos obrigatorios nao preenchidos. " });
      }
    }
  },
};
