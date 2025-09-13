import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password" //
    }
  });

  const mailOptions = {
    from: '"Movie Ticket 🎬" <your_email@gmail.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
