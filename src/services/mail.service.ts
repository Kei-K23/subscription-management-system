import { config } from "@/config";
import nodemailer from "nodemailer";

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  static async sendReminderEmail({
    toEmail,
    planName,
    expiryDate,
  }: {
    toEmail: string;
    planName: string;
    expiryDate: Date;
  }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "🚨 Subscription Expiry Reminder",
        html: `
          <p>Hello,</p>
          <p>Your subscription for <b>${planName}</b> will expire on <b>${
          expiryDate.toISOString().split("T")[0]
        }</b>.</p>
          <p>Please renew your subscription to continue enjoying our services.</p>
          <p>Thank you!</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${toEmail}`);
    } catch (error) {
      console.error("Error when sending Reminder email", error);
    }
  }
}
