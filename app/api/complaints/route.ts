import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Client (Admin context if needed, but using public vars for now if that's how it was set up)
// Ideally we use service role key for server-side, but I'll stick to what they had or use process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, title, description, category, contact_email } = body

        // 1. Store in Supabase (if configured)
        if (supabase) {
            const { error: dbError } = await supabase
                .from('feedback')
                .insert([
                    {
                        type,
                        title,
                        description,
                        category,
                        contact_email,
                        status: 'pending'
                    }
                ])

            if (dbError) {
                console.error('Supabase Error:', dbError)
                // We typically continue to try sending email even if DB fails, or throw?
                // Let's log but continue, ensuring the admin gets the email at least.
            }
        }

        // 2. Send Email
        // Configure transporter
        // Default to Outlook/Office365 for lums.edu.pk, but allow overrides
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.office365.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // tls: {
            //     ciphers: 'SSLv3'
            // }
        })

        // Email Content
        const subject = `[Portal ${type.toUpperCase()}] ${category}: ${title}`
        const htmlContent = `
            <h2>New ${type === 'complaint' ? 'Complaint' : 'Suggestion'} Received</h2>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                ${description.replace(/\n/g, '<br>')}
            </blockquote>
            <p><strong>Contact Email:</strong> ${contact_email || 'Not provided'}</p>
            <hr>
            <p><em>Sent from Student Council Portal</em></p>
        `

        // Send
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER || '"Stuco Portal" <noreply@council.edu>', // Sender address
            to: 'studentcouncil@lums.edu.pk', // List of receivers
            subject: subject,
            html: htmlContent,
        })

        console.log('Message sent: %s', info.messageId)

        return NextResponse.json({ success: true, message: 'Submitted successfully' })

    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
