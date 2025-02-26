const nodemailer = require("nodemailer");

const sendEmail = async (name, email, subject, code) => {
  console.log(
    "name,email,subject,code",
    name + " " + email + " " + " " + subject + " " + code
  );
  console.log(
    "user email & password",
    process.env.SMTP_USER + " " + process.env.SMTP_PASS
  );
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465, //If ssl 465 if not ssl then 587
      secure: true, //If ssl then true otherwise false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: `
            <h1>Hi ${name},</h1>
            <h2>OTP for ${subject}:</h2>
            <h3 style="color: green;"> your otp is ${code}</h3>           
            `,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent", error);
  }
};

module.exports = sendEmail;
