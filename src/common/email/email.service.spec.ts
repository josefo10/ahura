
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;

  const mockTransporter = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should log to console if transporter is not configured', async () => {
      process.env.SMTP_HOST = ''; // Ensure transporter is not configured
      const serviceWithoutSmtp = new EmailService();
      if (serviceWithoutSmtp['transporter']) {
        const sendMailSpy = jest.spyOn(serviceWithoutSmtp['transporter'], 'sendMail');
        await serviceWithoutSmtp.send('to', 'subject', 'html');
        expect(sendMailSpy).not.toHaveBeenCalled();
      } else {
        const loggerSpy = jest.spyOn(serviceWithoutSmtp['logger'], 'log');
        await serviceWithoutSmtp.send('to', 'subject', 'html');
        expect(loggerSpy).toHaveBeenCalled();
      }
    });

    it('should send an email if transporter is configured', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user';
      process.env.SMTP_PASS = 'pass';

      const emailServiceWithSmtp = new EmailService();
      (emailServiceWithSmtp['transporter'] as any) = { sendMail: mockTransporter.sendMail };

      await emailServiceWithSmtp.send('to', 'subject', 'html');
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });
});
