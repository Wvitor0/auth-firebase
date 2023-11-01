const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');

const admin = require("firebase-admin");
const credentials = require("./fir-85fd0-firebase-adminsdk-iqtmx-38f4da5fb5.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const SECRET = '"./fir-85fd0-firebase-adminsdk-iqtmx-38f4da5fb5.json"'; 

app.use(express.json());

app.use(express.urlencoded( {extended: true}));

app.get('/', (req, res) => {
    res.json({ info: 'Rotas: /cadastro, /login. EMAIL: user@example.com, SENHA: 123456'});
});

app.post('/cadastro', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
  
      res.status(200).json({
        statusCode: 200,
        message: 'Usuário criado!',
        data: {
          uid: userRecord.uid,
        },
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Erro ao criar usuário.',
      });
    }
  });

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await admin.auth().getUserByEmail(email);

      // Gerar um token JWT com o UID do usuário
      const token = jwt.sign({ uid: user.uid }, SECRET, {
        expiresIn: '2h', // O Token deve expirar em 2 horas
      });
  
      res.status(200).json({
        statusCode: 200,
        message: 'Login realizado com sucesso!',
        data: {
          token,
        },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(401).json({
        statusCode: 401,
        message: 'Usuário não encontrado ou senha incorreta.',
      });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
});