import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendEmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendTemplateEmail({ to, template, emailData }: any) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API);
      const msg = {
        from: 'no-reply@ananasolutions.com',
        to,
        templateId: template,
        dynamicTemplateData: emailData,
      };
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.log('===Error sending email===', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }
}
