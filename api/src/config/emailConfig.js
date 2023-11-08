const nodemailer = require('nodemailer');
const { config } = require('./config');

const transport = nodemailer.createTransport(config.email.smtp);

transport
    .verify()
    .then(() => console.info('Connected to email server'))
    .catch(() => console.info('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));

const sentOtpCodeToUserMail = async (user, otpCode) => {
    try {
        const mailOptions = {
            from: config.email_from,
            to: user.email,
            subject: 'OTP Code',
            text: `Your OTP code is ${otpCode} and will expire in 5 minutes`,
        };
    
        await transport.sendMail(mailOptions);
        console.info(`OTP code sent to ${user.email}`);
    } catch (error) {
       console.error('Error sending OTP code to user email', error); 
    }
};

module.exports = {
    sentOtpCodeToUserMail
}
    
