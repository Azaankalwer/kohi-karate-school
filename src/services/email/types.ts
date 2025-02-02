export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export interface EmailOptions {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}