const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Wista Tour <hello@wishta.app>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  await transporter.sendMail(mailOptions);
};

const corsConfig = {
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true,
};

module.exports = { sendEmail, corsConfig };
