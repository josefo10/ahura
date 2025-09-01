import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private transporter: nodemailer.Transporter | null = null;
  private from = process.env.MAIL_FROM || 'no-reply@example.com';

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && port && user && pass) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP not configured — falling back to console logger for emails',
      );
    }
  }

  async send(to: string, subject: string, html: string) {
    console.log('envia correo', to, subject, html, this.from);
    if (!this.transporter) {
      this.logger.log(
        `[DEV-EMAIL] To: ${to} | Subject: ${subject} | HTML: ${html.replace(/\n/g, ' ')}`,
      );
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const re = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
      console.log('response email', re);
    } catch (error) {
      console.log('error -->', error);
    }
  }
}
