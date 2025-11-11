import fs from 'fs';
import path from 'path';
import transporter from './emailTransporter';
import 'dotenv/config';
interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string; // e.g. 'otp.html'
  replacements: Record<string, string>; // { OTP: '123456', NAME: 'Alex' }
  from?: string;
}

export async function sendEmail({ to, subject, templateName, replacements, from }: SendEmailOptions) {
  // Find the template file in /public/email_templates
  const templatePath = path.join(process.cwd(), 'public', 'email_templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf8');

  // Replace keys in the template
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    html = html.replace(regex, value);
  });

  // Send email with error handling
  try {
    const info = await transporter.sendMail({
      from: from || process.env.BREVO_SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
