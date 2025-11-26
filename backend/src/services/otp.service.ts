import { authenticator } from 'otplib';
import { prisma } from '../config/database';
import { sendEmail, emailTemplates } from '../utils/email';
import { AppError } from '../middleware/errorHandler';

// Configure OTP settings
authenticator.options = {
  step: 300, // 5 minutes validity
  window: 1,
};

export class OTPService {
  // Generate a 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create and send OTP
  async createAndSendOTP(userId: string, email: string, purpose: 'VERIFICATION' | 'PASSWORD_RESET') {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await prisma.oTP.create({
      data: {
        userId,
        code: otp,
        purpose,
        expiresAt,
      },
    });

    // Send OTP email
    const subject = purpose === 'VERIFICATION' ? 'Verify Your Email' : 'Reset Your Password';
    const emailContent = purpose === 'VERIFICATION'
      ? emailTemplates.otpVerification(otp)
      : emailTemplates.passwordReset(otp);

    await sendEmail({
      to: email,
      subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    return { success: true, expiresAt };
  }

  // Verify OTP
  async verifyOTP(userId: string, code: string, purpose: 'VERIFICATION' | 'PASSWORD_RESET') {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId,
        code,
        purpose,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Update user as verified if it's for verification
    if (purpose === 'VERIFICATION') {
      await prisma.user.update({
        where: { id: userId },
        data: { isEmailVerified: true },
      });
    }

    return { success: true };
  }

  // Resend OTP
  async resendOTP(userId: string, email: string, purpose: 'VERIFICATION' | 'PASSWORD_RESET') {
    // Invalidate previous OTPs
    await prisma.oTP.updateMany({
      where: {
        userId,
        purpose,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Create and send new OTP
    return this.createAndSendOTP(userId, email, purpose);
  }

  // Clean up expired OTPs (run periodically)
  async cleanupExpiredOTPs() {
    await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
