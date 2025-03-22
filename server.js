const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "lista_tarefas",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados!");
});

// Criar uma nova tarefa
app.post("/tarefas", (req, res) => {
  const { titulo, descricao } = req.body;
  const sql = "INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, 0)";
  db.query(sql, [titulo, descricao], (err, result) => {
    if (err) {
      console.error("Erro ao inserir tarefa:", err);
      res.status(500).json({ erro: err.message });
    } else {
      res.status(201).json({ id: result.insertId, titulo, descricao, concluida: 0 });
    }
  });
});

console.log("Dados recebidos:", { titulo, descricao });


// Listar todas as tarefas
app.get("/tarefas", (req, res) => {
  const sql = "SELECT * FROM tarefas";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(results);
    }
  });
});

// Marcar como concluída
app.put("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body;
  const sql = "UPDATE tarefas SET concluida = ? WHERE id = ?";
  db.query(sql, [concluida, id], (err) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json({ mensagem: "Tarefa atualizada com sucesso!" });
    }
  });
});

// Deletar uma tarefa
app.delete("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tarefas WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json({ mensagem: "Tarefa removida!" });
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
