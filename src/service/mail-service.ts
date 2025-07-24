import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export class MailService {
  passwordRecoveryMessageCreator(token: string): string {
    return `
        <h1>Esqueceu sua senha, né? </h1>
        <img src="https://img.buzzfeed.com/buzzfeed-static/static/2021-04/8/19/enhanced/0756e66fe1e2/enhanced-2871-1617909958-27.png?output-format=jpg&output-quality=auto" alt="JIm" width="300" />
        <p>Utilize o token abaixo para trocar sua senha: </p>
        <p> ${token} </p>
    `;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(recipient: string, subject: string, token: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: `"Test API" <${process.env.MAIL_USER}>`,
      to: recipient,
      subject: subject,
      html: this.passwordRecoveryMessageCreator(token),
    });

    console.log("Email enviado: " + info.messageId);
  }
}
