import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase';
import { EmailOptions, SendEmailResult } from './types';
import { emailConfig } from '../../config/email';

const sendEmailFunction = httpsCallable(functions, 'sendEmail');

export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  try {
    const emailData = {
      to: options.to,
      from: options.from || emailConfig.defaultSender,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text
    };

    await sendEmailFunction(emailData);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}