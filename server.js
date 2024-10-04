const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'u552141195_fun_user',
  password: 'Fun_@pp_2024',
  database: 'u552141195_fun_app'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

// Exemplo de rota POST para salvar dados
app.post('/salvar', (req, res) => {
  const { nome, email } = req.body;
  
  const query = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
  connection.query(query, [nome, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Usuário salvo com sucesso!' });
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
