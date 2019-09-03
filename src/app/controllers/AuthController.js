const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth')
const router = express.Router();
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/register", async (req, res) => {
    try {

        const { email } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).send({ error: "Usuário já existe." });

        // console.log(req.body)
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({ id: user.id })
        });
        
    } catch (e) {
        res.status(400).send({ error: 'Falha no registro.' });
        console.log(e)
    }
});

router.post("/authenticate", async (req, res) => {  
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: "Usuário não encontrado." })
    }

    if (! await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: "Senha inválida." })
    }

    user.password = undefined;

    const token = 

    res.send({ 
        user, 
        token: generateToken({ id: user.id })
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: "Usuário não encontrado" })
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);


        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'awillian0@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err) {
                return res.status(400).send({ error: "Não podemos enviar a alteração de senha" });
            }

            return res.send();
        });


    } catch (err) {
        res.status(400).send({ error: "Error no esqueceu sua senha", return: err })
    }
});

router.post('/reset_password', async (req, res) => {

    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email }).
            select("+passwordResetExpires passwordResetToken");

        if (!user) {
            return res.status(400).send({ error: "Usuário não encontrado" });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: "Token invalido" });
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res.status(400).send({ error: "Token expirou, gere um novo" });
        }

        user.password = password;

        await user.save();

        res.send();
    } catch (err) {
        res.status(400).send({ error: "Impossivel resetar a senha, tente novamente!", return: err })
    }
});

module.exports = app => app.use('/auth', router);