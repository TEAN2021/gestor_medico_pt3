const Physician = require("../models/Physician");
const Appointment = require("../models/Appointment");

module.exports = {
  async listAllPhysician(req, res) {
    const physicians = await Physician.findAll({
      order: [["name", "ASC"]],
    }).catch((error) => {
      res.status(500).json({ msg: "Falha na conexao. " });
    });

    if (physicians) res.status(200).json({ physicians });
    else
      res.status(404).json({
        msg: "Nao foi possivel encontrar medicos",
      });
  },
  async newPhysician(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        msg: "Dados obrigatorios nao foram preenchidos.",
      });
    }

    const isPhysicianNew = await Physician.findOne({
      where: { email },
    });
    if (isPhysicianNew)
      res.status(403).json({ msg: "Medico ja foi cadastrado." });
    else {
      const physician = await Physician.create({
        name,
        email,
        password,
      }).catch((error) => {
        res.status(500).json({ msg: "Nao foi possivel inserir os dados." });
      });
      if (physician)
        res.status(201).json({ msg: "Novo medico foi adicionado" });
      else
        res.status(404).json({ msg: "Nao foi possivel cadastrar novo medico" });
    }
  },
  async updatePhysician(req, res) {
    const physicianId = req.body.id;
    const physician = req.body;
    if (!physicianId) res.status(404).json({ msg: "ID do medico vazio. " });
    else {
      const physicianExists = await Physician.findByPk(physicianId);
      if (!physicianExists)
        res.status(404).json({ msg: "Medico nao encontrado. " });
      else {
        if (physician.name || physician.email || physician.password) {
          await Physician.update(physician, {
            where: { id: physicianId },
          });
          return res.status(200).json({ msg: "Medico atualizado com sucesso" });
        } else
          return res
            .status(400)
            .json({ msg: "Campos obrigatorios nao preenchidos. " });
      }
    }
  },
  async deletePhysician(req, res) {
    const physicianId = req.params.id;
    const deletedPhysician = await Physician.destroy({
      where: { id: physicianId },
    }).catch(async (error) => {
      const physicianHasRef = await Appointment.findOne({
        where: { physicianId },
      }).catch((error) => {
        res.status(500).json({ msg: "Falha na conexao" });
      });
      if (physicianHasRef)
        return res
          .status(403)
          .json({ msg: "Medico possui consultas em seu nome." });
    });
    if (deletedPhysician != 0) {
      res.status(200).json({ msg: "Medico excluido com sucesso." });
    } else res.status(404).json({ msg: "Medico nao encontrado." });
  },
};
