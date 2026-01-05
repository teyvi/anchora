import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error)
  } else {
    console.log('Email server is ready to send messages')
  }
})

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export const sendWelcomeEmail = async (email: string): Promise<boolean> => {
  const setPasswordUrl = `${process.env.FRONTEND_URL}/set-password?email=${encodeURIComponent(email)}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>An account has been created for you at <strong>${email}</strong>.</p>
          <p>To get started, you need to set up your password by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${setPasswordUrl}" class="button">Set Your Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4CAF50;">${setPasswordUrl}</p>
          
          <p><strong>Important:</strong> This link is valid for your first login. If you don't set your password, you won't be able to access your account.</p>
          
          <p>If you did not expect this email, please contact our support team.</p>
          
          <p>Best regards,<br>The Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Welcome! Set Your Password',
    html,
  })
}

export const sendPasswordSetConfirmation = async (email: string): Promise<boolean> => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Password Set Successfully! 🎉</h2>
          <p>Hello,</p>
          <p>Your password has been set successfully. You can now login to your account.</p>
          
          <div style="text-align: center;">
            <a href="${loginUrl}" class="button">Login Now</a>
          </div>
          
          <p>If you did not set this password, please contact our support team immediately.</p>
          
          <p>Best regards,<br>The Team</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Password Set Successfully',
    html,
  })
}