const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const port = 8080;

app.use(cookieParser());

// Configurações do Firebase Admin SDK
const serviceAccount = require('./casaexpress-be1ec-firebase-adminsdk-trea0-c8b6b52aa4.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Configurações do OAuth2 do Google
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Substitua pelo seu ID de cliente do Google
const client = new OAuth2Client(CLIENT_ID);

app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para iniciar o processo de login com o Google
app.get('/loginGoogle', (req, res) => {
    const redirectUrl = `http://localhost:${port}/callbackGoogle`;
    const scopes = ['email']; // Escopos para solicitar permissão do usuário
    const url = client.generateAuthUrl({
        access_type: 'offline', // Permite obter um token de atualização
        scope: scopes,
        redirect_uri: redirectUrl
    });
    res.redirect(url);
});

// Rota de retorno do Google após o login bem-sucedido
app.get('/callbackGoogle', async (req, res) => {
    const redirectUrl = `http://localhost:${port}/callbackGoogle`;
    const code = req.query.code;

    try {
        const tokenResponse = await client.getToken({ code, redirect_uri: redirectUrl });
        const accessToken = tokenResponse.tokens.access_token;

        // Use o token de acesso para obter as informações do usuário do Google
        const userinfoResponse = await client.verifyIdToken({
            idToken: accessToken,
            audience: CLIENT_ID,
        });
        const userinfoPayload = userinfoResponse.getPayload();
        const userId = userinfoPayload.sub;

        // Aqui você tem o ID do usuário, faça o que precisar com ele
        console.log('ID do usuário:', userId);

        // Redirecione ou faça outra coisa com base no ID do usuário
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error.message);
        res.status(500).send('Erro ao fazer login com o Google.');
    }
});

// Rota para a página de cadastro
app.get('/cad', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
