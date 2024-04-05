const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
const serviceAccount = require('./casaexpress-be1ec-firebase-adminsdk-trea0-c8b6b52aa4.json');

const app = express();
const path = require('path');
const port = 8080;

// Inicialização do Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Inicialização do OAuth2 do Google
const CLIENT_ID = '1073721668261-7ri1irvn5r2tmgfqbotsi4anr88ddtcd.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/loginGoogle', (req, res) => {
    const redirectUrl = `http://localhost:${port}/callbackGoogle`;
    const scopes = ['email'];
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        redirect_uri: redirectUrl,
    });
    res.redirect(url);
});

app.get('/callbackGoogle', async (req, res) => {
    const redirectUrl = `http://localhost:${port}/callbackGoogle`;
    const code = req.query.code;

    try {
        const tokenResponse = await client.getToken({ code, redirect_uri: redirectUrl });
        const accessToken = tokenResponse.tokens.access_token;

        const userinfoResponse = await client.verifyIdToken({
            idToken: accessToken,
            audience: CLIENT_ID,
        });
        const userinfoPayload = userinfoResponse.getPayload();
        const userId = userinfoPayload.sub;

        console.log('ID do usuário:', userId);
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error.message);
        res.status(500).send('Erro ao fazer login com o Google.');
    }
});

app.get('/cad', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
