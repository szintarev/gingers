import nodemailer from 'nodemailer'

// Reuse one transporter instance across requests (nodemailer is not stateless like Resend)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
