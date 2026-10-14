import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Ethereal / console stream fallback for reliable local development without SMTP secrets
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }

    return this.transporter;
  }

  public static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = await this.getTransporter();
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const info = await transporter.sendMail({
      from: '"NeuroSage" <wellness@neurosage.org>',
      to: email,
      subject: 'Verify your NeuroSage account — Be kind to your mind',
      text: `Welcome to NeuroSage.\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\nWarm regards,\nThe NeuroSage Team`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #F8F4ED; color: #44362F; border-radius: 8px;">
          <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #B87560; margin-bottom: 8px;">Welcome to NeuroSage</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #786A61;">
            Thank you for taking a step toward mental wellness. Please confirm your email address to activate your full access:
          </p>
          <div style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background-color: #B87560; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 13px; color: #786A61; margin-top: 24px; border-top: 1px solid #E6D5C3; padding-top: 16px;">
            If you did not create this account, you can safely ignore this email.<br/>
            <em>Be kind to your mind.</em>
          </p>
        </div>
      `,
    });

    if (info.message) {
      console.log(`[EmailService] Verification email sent to ${email} (Preview URL / stream ready)`);
    }
  }

  public static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const transporter = await this.getTransporter();
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"NeuroSage" <support@neurosage.org>',
      to: email,
      subject: 'Password Reset Request — NeuroSage',
      text: `You requested a password reset for NeuroSage.\n\nClick the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #F8F4ED; color: #44362F; border-radius: 8px;">
          <h2 style="font-family: 'DM Serif Display', Georgia, serif; color: #B87560; margin-bottom: 8px;">Password Reset</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #786A61;">
            We received a request to reset the password for your NeuroSage account.
          </p>
          <div style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #B87560; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #786A61; margin-top: 24px; border-top: 1px solid #E6D5C3; padding-top: 16px;">
            This link is valid for 1 hour. If you did not request this, your password remains secure.
          </p>
        </div>
      `,
    });
  }
}
