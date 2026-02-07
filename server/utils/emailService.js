import nodemailer from "nodemailer";

export async function notifyCcmNewUserRequest(name, email) {
  
  // Validate email/password
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Email service not configured.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  try {
    const emailMessage = `
      <div style="font-family: Arial, sans-serif;">
        <h1>New User Request</h1>
        <p>Please approve this user:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: "meredil3@uci.edu",
      subject: "New User Request",
      text: `New user request from ${name} (${email})`,
      html: emailMessage,
    });

    console.log("New user email sent");
  } catch (err) {
    console.error("Error sending mail", err);
  }
}