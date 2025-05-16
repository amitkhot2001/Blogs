const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (toEmail, otp) => {
  const msg = {
    to: toEmail,
    from: process.env.SENDER_EMAIL, // Verified SendGrid sender email
    subject: 'Your OTP Code for Signup',
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  };

  await sgMail.send(msg);
};

module.exports = sendOTPEmail;
