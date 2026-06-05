import { db } from "@/db/db-pgp";
import escapeHtml from "escape-html";
import nodemailer from "nodemailer";

export async function notifyCcmNewUserRequest(name, email) {
  // Validate email/password, early return if not configured.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Email service not configured.");
    return;
  }

  // Sanitize
  const sanitizedName = escapeHtml(name);
  const sanitizedEmail = escapeHtml(email);
  // change this when deployed
  const approvalUrl = `http://localhost:3000/user-directory`;

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
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p>Approve them <a href="${approvalUrl}">here</a></p>
      </div>
    `;

    const masterRows = await db.query(`SELECT email FROM users WHERE role = 'master'`);
    const ccmRows = await db.query(`SELECT email FROM users WHERE role = 'ccm'`);

    if ((!masterRows || !masterRows.length) && (!ccmRows || !ccmRows.length)) {
      throw new Error("Cannot find any master or ccm users.");
    }

    if (masterRows.length > 1) {
      throw new Error(`Expected at most one master user, found ${masterRows.length}.`);
    }

    const masterEmails = masterRows.map((r) => r.email).join(", ");
    const ccmEmails = ccmRows.map((r) => r.email).join(", ");

    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: masterEmails || undefined,
      cc: ccmEmails || undefined,
      subject: "New User Request",
      text: `New user request from ${sanitizedName} (${sanitizedEmail})`,
      html: emailMessage,
    });

    console.log("New user email sent");
  } catch (err) {
    console.error("Error sending mail", err);
  }
}


export async function notifyApprovedNewUser(name, email) {
  // Validate email/password, early return if not configured.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Email service not configured.");
    return;
  }

  // Sanitize
  const sanitizedName = escapeHtml(name);
  const sanitizedEmail = escapeHtml(email);

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
        <h1>User Approved</h1>
        <p>Account has been approved for</p>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p>Welcome!</a></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "User Approval Notice",
      text: `Your account has been approved.`,
      html: emailMessage,
    });

    console.log("New user email sent");
  } catch (err) {
    console.error("Error sending mail", err);
  }
}