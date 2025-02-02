import { Student } from '../types/student';

export async function sendRegistrationEmail(student: Student) {
  const emailContent = `
Dear ${student.firstName} ${student.lastName},

Welcome to KohiKarate JKA! We're excited to have you join our dojo.

Registration Details:
- Belt Rank: ${student.beltRank}
- Registration Date: ${new Date(student.joinDate).toLocaleDateString()}

If you have any questions, please don't hesitate to contact us.

Best regards,
KohiKarate JKA Team
  `;

  // In a real application, you would use an email service here
  // For now, we'll just log the email content
  console.log('Sending registration email:');
  console.log('From: mike@headstartsolutions.co.nz');
  console.log(`To: ${student.email}`);
  console.log(`Subject: Karate Registration - ${student.firstName} ${student.lastName}`);
  console.log('Content:', emailContent);
}