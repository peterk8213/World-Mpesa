import nodemailer from "nodemailer";
import { ManualPayout } from "@/types";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or another provider like 'hotmail'
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASSWORD, // app password or SMTP password
  },
});

export async function sendWithdrawalEmail(payout: ManualPayout) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #2c3e50;">💸 New Withdrawal Request</h2>
      <p>A new manual payout request has been submitted and is awaiting your review.</p>
      <hr/>
      <table style="width: 100%; font-size: 14px; color: #333;">
        <tr><td><strong>Receiver Name:</strong></td><td>${
          payout.ReceiverPartyPublicName
        }</td></tr>
        <tr><td><strong>Phone Number:</strong></td><td>${
          payout.phoneNumber
        }</td></tr>
        <tr><td><strong>Amount in KES:</strong></td><td>KES ${
          payout.amountinKes
        }</td></tr>
        <tr><td><strong>Amount in USD:</strong></td><td>USD ${
          payout.amountinUsd
        }</td></tr>
        <tr><td><strong>Actual Charges:</strong></td><td>KES ${
          payout.actualCharges
        }</td></tr>
        <tr><td><strong>Fees:</strong></td><td>USD ${payout.fees}</td></tr>
        <tr><td><strong>Status:</strong></td><td>${payout.status}</td></tr>
        <tr><td><strong>Description:</strong></td><td>${
          payout.notes || "N/A"
        }</td></tr>
        <tr><td><strong>Request Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <br/>
      <p style="margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin-only-page/payout"
         style="display: inline-block; background-color: #2b6cb0; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
        Review in Admin Dashboard
      </a>
    </p>
    
      <p style="font-size: 13px; color: #7f8c8d;">This email was automatically sent by your system.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Nekron Alerts" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 New Withdrawal Request Pending Review",
    html,
  });
}
