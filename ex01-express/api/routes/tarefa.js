import { Router } from "express";
import models from "../models/index.js";

const router = Router();

const tarefaModel = models.Tarefa;


router.get("/", async (req, res) => {
  const getTarefas = await tarefaModel.findAll();


  return res.status(200).send({
    message: "Exibindo todas as tarefas",
    data: getTarefas,
  });
});


router.get("/:tarefaId", async (req, res) => {
  const { tarefaId } = req.params;

  const getTarefa = await tarefaModel.findByPk(tarefaId);

  if (!getTarefa) {
    return res.status(404).send({
      error: "Tarefa não encontrada",
    });
  }

  return res.status(200).send({
    message: "Tarefa encontrada",
    data: getTarefa,
  });
});


router.post("/", async (req, res) => {
  const { descricao } = req.body;


  if (!descricao) {
    return res.status(400).send({ error: "Por favor, forneça uma descrição para a tarefa." });
  }

  const createdTarefa = await tarefaModel.create({ descricao });

  return res.status(201).send({
    message: "Tarefa criada com sucesso",
    data: createdTarefa,
  });
});


router.put("/:tarefaId", async (req, res) => {
  const { tarefaId } = req.params;
  const { descricao, concluida } = req.body;

  const getTarefa = await tarefaModel.findByPk(tarefaId);
  if (!getTarefa) {
    return res.status(404).send({
      error: "Tarefa não encontrada",
    });
  }


  await tarefaModel.update({ descricao, concluida }, {
    where: {
      id: tarefaId,
    },
  });


  return res.status(200).send({
    message: "A tarefa foi atualizada",
  });
});


router.delete("/:tarefaId", async (req, res) => {
  const { tarefaId } = req.params;

  const getTarefa = await tarefaModel.findByPk(tarefaId);

  if (!getTarefa) {
    return res.status(404).send({
      error: "Tarefa não encontrada",
    });
  }

  await tarefaModel.destroy({ where: { id: tarefaId } });


  return res.status(204).send();
});

export default router;