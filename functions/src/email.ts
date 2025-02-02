import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendEmail = functions.https.onCall(async (data, context) => {
  try {
    const { to, from, subject, text, html } = data;

    // Validate input
    if (!to || !subject || !text) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required email fields'
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid recipient email address'
      );
    }

    if (from && !emailRegex.test(from)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid sender email address'
      );
    }

    // Here you would integrate with your preferred email service
    // For example: SendGrid, Mailgun, AWS SES, etc.
    
    // For now, just log the email attempt
    console.log('Email request:', {
      to,
      from: from || 'noreply@kohikarate.com',
      subject,
      text,
      html: html || text
    });

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to send email'
    );
  }
});