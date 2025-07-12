const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // seu e-mail gmail completo
        pass: process.env.EMAIL_PASS, // senha de app gerada
    }
});

async function enviarEmail(destinatario, assunto, texto, html, attachments = []) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: assunto,
        text: texto,
        html: html,
        attachments: attachments, // Adiciona os anexos ao e-mail
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado para ${destinatario}`);
    } catch (err) {
        console.error('Erro ao enviar email:', err);
    }
}

module.exports = { enviarEmail };
