import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/sendEmail';
import 'dotenv/config';
export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        await sendEmail({
            to: process.env.CLIENT_EMAIL || 'default@example.com',
            subject: 'New Message Received',
            templateName: 'message.html',
            replacements: {
                NAME: name,
                EMAIL: email,
                MESSAGE: message,
            },
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}