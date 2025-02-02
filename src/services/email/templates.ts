import { EmailTemplate } from './types';
import { Student } from '../../types/student';
import { formatNZDate } from '../../utils/dateTime';

export function getRegistrationEmailTemplate(student: Student): EmailTemplate {
  const text = `
Dear ${student.firstName} ${student.lastName},

Welcome to KohiKarate JKA! We're excited to have you join our dojo.

Registration Details:
- Belt Rank: ${student.beltRank}
- Registration Date: ${formatNZDate(new Date(student.joinDate))}

If you have any questions, please don't hesitate to contact us.

Best regards,
KohiKarate JKA Team
`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4F46E5;">Welcome to KohiKarate JKA!</h2>
  
  <p>Dear ${student.firstName} ${student.lastName},</p>
  
  <p>We're excited to have you join our dojo!</p>
  
  <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #374151;">Registration Details</h3>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 10px;">
        <strong>Belt Rank:</strong> ${student.beltRank}
      </li>
      <li>
        <strong>Registration Date:</strong> ${formatNZDate(new Date(student.joinDate))}
      </li>
    </ul>
  </div>
  
  <p>If you have any questions, please don't hesitate to contact us.</p>
  
  <p style="margin-top: 30px;">
    Best regards,<br>
    KohiKarate JKA Team
  </p>
</div>
`;

  return {
    subject: `Welcome to KohiKarate JKA - ${student.firstName} ${student.lastName}`,
    text,
    html
  };
}

export function getPaymentReceiptTemplate(
  student: Student,
  amount: number,
  date: string
): EmailTemplate {
  const text = `
Dear ${student.firstName} ${student.lastName},

We have received your payment of $${amount.toFixed(2)} on ${formatNZDate(new Date(date))}.

Thank you for your continued support of KohiKarate JKA.

Best regards,
KohiKarate JKA Team
`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4F46E5;">Payment Receipt</h2>
  
  <p>Dear ${student.firstName} ${student.lastName},</p>
  
  <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #374151;">Payment Details</h3>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 10px;">
        <strong>Amount:</strong> $${amount.toFixed(2)}
      </li>
      <li>
        <strong>Date:</strong> ${formatNZDate(new Date(date))}
      </li>
    </ul>
  </div>
  
  <p>Thank you for your continued support of KohiKarate JKA.</p>
  
  <p style="margin-top: 30px;">
    Best regards,<br>
    KohiKarate JKA Team
  </p>
</div>
`;

  return {
    subject: `KohiKarate JKA - Payment Receipt`,
    text,
    html
  };
}