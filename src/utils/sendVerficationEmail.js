const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  otp,
}) => {

  const message = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333333;
      }
      .container {
        width: 90%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #e2e2e2;
        border-radius: 8px;
        background-color: #ffffff;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eeeeee;
      }
      .content {
        margin-top: 20px;
      }
      .otp {
        font-size: 24px;
        color: #4CAF50;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #aaaaaa;
        text-align: center;
        border-top: 1px solid #eeeeee;
        padding-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Verify Your Email Address</h2>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>Thank you for registering with us! To complete your registration, please use the following OTP code:</p>
        <p class="otp">${otp}</p>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not register on our platform, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} PreciAgri. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;


  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
