const nodemailer = require('nodemailer');
const path = require('path');
const { host, port, user, pass } = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./src/resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html',
}))


module.exports = transport;