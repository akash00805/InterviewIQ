const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, verificationLink) => {
  try {
    await transporter.sendMail({
      from: `"InterviewIQ" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Email Verification - InterviewIQ',
      html: `
        <h2>Welcome to InterviewIQ!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
    console.log('✅ Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return false;
  }
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"InterviewIQ" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset - InterviewIQ',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    console.log('✅ Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return false;
  }
};