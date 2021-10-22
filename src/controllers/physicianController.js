const Physician = require("../models/Physician");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function passwordValidation(password) {
  if(password.length < 8)
		return "Senha deve ter no mínimo 8 caracteres.";
	else if(!password.match(/[a-z]/g))
		return "Senha deve ter no mínimo uma letra minuscula.";
	else if(!password.match(/[A-Z]/g))
		return "Senha deve ter no mínimo uma letra maíuscula.";
	else if(!password.match(/[@!#$%^&*()/\\]/g))
		return "Senha deve ter no mínimo um caracter especial.";
	else if(!password.match(/[0-9]+/))
		return "Senha deve ter no minimo um número";
	else return "OK";
}

function generateToken(id) {
	console.log(process.env.JWT_SECRET);
	process.env.JWT_SECRET = Math.random().toString(36).slice(-20);
	console.log(process.env.JWT_SECRET);
	const token = jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: 86400,
	});
	console.log(token);
	return token;
}

module.exports = {

  async authentication(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    
    if(!email || !password)
      return res.status(400).json({ msg: "Campos obrigatórios vazios!" });
    try{
      const physician = await Physician.findOne({
        where: {email},
      });

      if(!physician)
        return res.status(404).json({ msg: "Usuário ou senha inválidos." });
      else {
        if(bcrypt.compareSync(password, physician.password)){
          const token = generateToken(physician.id);
          return res.status(200).json({ msg: "Autenticado com sucesso.", token });
        }
        else
          return res.status(404).json({ msg: "Usuário ou senha inválidos." });
      }
    }
    catch(error){
      res.status(500).json(error);
    }
  },

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

    const passwordValid = passwordValidation(password);
    if(passwordValid !== "OK")
      return res.status(400).json({ msg: passwordValid });

    const isPhysicianNew = await Physician.findOne({
      where: { email },
    });
    if (isPhysicianNew)
      res.status(403).json({ msg: "Medico ja foi cadastrado." });
    else {
      
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(password, salt);
      
      const physician = await Physician.create({
        name,
        email,
        password : hash,
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
