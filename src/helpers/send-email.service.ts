import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public async sendLoginDetails({ to, emailData }) {
    try {
      const message = {
        from: 'no-reply@ananasolutions.com',
        to,
        templateId: process.env.LOGIN_EMAIL_TEMPLATE_ID,
        dynamicTemplateData: emailData,
      };
      await sgMail.send(message);
    } catch (error) {
      console.log('error sending login email', error);
    }
  }

  public async sendEventEmails(to, emailData) {
    try {
      const message = {
        from: 'no-reply@ananasolutions.com',
        to,
        templateId: process.env.EVENT_EMAIL_TEMPLATE_ID,
        dynamicTemplateData: emailData,
      };
      await sgMail.send(message);
    } catch (error) {
      console.log('error sending events email', error);
    }
  }
}
