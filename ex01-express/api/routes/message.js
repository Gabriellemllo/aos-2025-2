import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const messagesModel = models.Message;

router.get("/", async (req, res) => {
  const getMessages = await messagesModel.findAll();

  return res.status(200).send({
    message : "Exibindo todas as mensagens",
    data : getMessages
  });
});

router.get("/:messageId", async (req, res) => {
  const { messageId } = req.params;

  const getMessage = await messagesModel.findByPk(messageId);

  if(!getMessage){
    return res.status(404).send({
      error : "Mensagem não encontrada"
    })
  }

  return res.status(200).send({
    message : "Mensagem encontrada",
    data : getMessage,
  });
});

router.post("/", async (req, res) => {
  const { text } = req.body

  const message = {
    text: text,
    userId: req.context.me.id,
  };

  if(!text || !req.context.me?.id){
    return res.status(400).send({error : "Por favor preencha os campos ou efetue o seu login!!"})
  }

  const createdMessage = await messagesModel.create(message);

  return res.status(201).send({
    message : "Mensagem enviada",
    data : createdMessage
  });
});

router.put("/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;

  const getMessage = await messagesModel.findByPk(messageId);
  if(!getMessage){
    return res.status(404).send({
      error : "Mensagem não encontrada"
    })}

  await messagesModel.update({text}, {where: {
    id : messageId
  }})

  return res.status(200).send({
    message : "A mensagem foi atualizada"
  })
})

router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;

  const getMessage = await messagesModel.findByPk(messageId);

  if(!getMessage){
    return res.status(404).send({
      error : "Mensagem não encontrada"
    })
  }

  await messagesModel.destroy({where : {id : messageId}});

  return res.status(200).send({
    message : "Mensagem deletada"
  });
});

export default router;
