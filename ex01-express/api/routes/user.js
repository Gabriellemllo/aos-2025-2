import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const user = models.User;

router.get("/", async (req, res) => {
  const allUser = await user.findAll();

  return res.status(200).send({
    "data" : allUser,
  });
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const getUser = await user.findByPk(userId);

  if(!getUser){
    return res.status(404).send({
      error: "Usuário não encointrado",
    });
  }
  return res.status(200).send({
    message : "Usuário encontrado com sucesso.",
    data : getUser
  });
});

router.post("/", async (req, res) => {
  const { username ,email } = req.body;

  if (!username?.trim() || !email?.trim()) {
    return res.status(400).send({
      error: "Os campos 'username' e 'email' são obrigatórios."
    });
  }
  
  const newUserData = {
    email,
    username 
  }

  const newUser = await user.create(newUserData);
  
  return res.status(201).send({
    message : "Usuário criado com sucesso.",
    data : newUser
  });
});

router.put("/:userId", async(req, res) => {
  const { userId } = req.params
  const { username,email } = req.body;

  const userExist = await user.findByPk(userId);

  if(!userExist){
    return res.status(404).send({
      error: "Usuário não encontrado!!"
    })
  }

  const newUserData = {
    email : email,
    username: username 
  }

  await user.update(newUserData, {where: {
    id : userId
  }})

  return res.status(200).send({
    message : "Usuário atualizado com sucesso.",
    data : newUserData,
  });
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  const userExist = await user.findByPk(userId);

  if(!userExist){
    return res.status(404).send({
      error: "Usuário não encontrado!!"
    })
  }

  await user.destroy({
    where:{
      id : userId,
    }
  })

  return res.status(204).send({
    message : "Usuário deletado com sucesso!!"
  });
});

export default router;
