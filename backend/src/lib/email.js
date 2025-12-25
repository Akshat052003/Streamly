import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASSWORD // Your app password
        }
    });
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, fullName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Your App Name',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset OTP',
            html: `
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
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 0 0 5px 5px;
                        }
                        .otp-box {
                            background-color: #f0f0f0;
                            border: 2px dashed #4CAF50;
                            padding: 20px;
                            text-align: center;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 5px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 10px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${fullName},</p>
                            <p>We received a request to reset your password. Use the OTP below to proceed with the password reset:</p>
                            
                            <div class="otp-box">
                                ${otp}
                            </div>
                            
                            <p><strong>This OTP is valid for 10 minutes.</strong></p>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
                            </div>
                            
                            <p>Thank you,<br>Your App Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Send Password Reset Success Email
export const sendPasswordResetSuccessEmail = async (email, fullName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Your App Name',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset Successful',
            html: `
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
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 0 0 5px 5px;
                        }
                        .success-icon {
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Successful</h1>
                        </div>
                        <div class="content">
                            <div class="success-icon">✅</div>
                            <p>Hello ${fullName},</p>
                            <p>Your password has been successfully reset.</p>
                            <p>You can now log in with your new password.</p>
                            <p>If you did not make this change, please contact support immediately.</p>
                            <p>Thank you,<br>Your App Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset success email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset success email:', error);
        // Don't throw error here as password is already reset
        return { success: false };
    }
};