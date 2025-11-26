import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { RegisterInput, LoginInput, AuthResponse } from '../types';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { sendEmail, emailTemplates } from '../utils/email';
import { OTPService } from './otp.service';

const otpService = new OTPService();

const SALT_ROUNDS = 10;

export class AuthService {
  async register(input: RegisterInput): Promise<Omit<AuthResponse, 'token'> & { requiresVerification: boolean }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
    });

    // Send OTP for email verification
    await otpService.createAndSendOTP(user.id, user.email, 'VERIFICATION');

    // Send welcome email (non-blocking)
    const emailContent = emailTemplates.welcome(user.firstName);
    sendEmail({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    }).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      requiresVerification: true,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new AppError(403, 'Please verify your email before logging in', { userId: user.id, email: user.email });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // Create login notification
    const loginTime = new Date().toLocaleString();
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'NEW_LOGIN',
        title: 'New Login Detected',
        message: `A new login was detected on your account at ${loginTime}`,
      },
    });

    // Send login notification email (non-blocking)
    const emailContent = emailTemplates.newLogin(user.firstName, 'Web Browser', loginTime);
    sendEmail({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    }).catch((error) => {
      console.error('Failed to send login notification email:', error);
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        hasCompletedTutorial: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });

    return user;
  }

  async verifyOTP(userId: string, code: string): Promise<void> {
    await otpService.verifyOTP(userId, code, 'VERIFICATION');
  }

  async resendOTP(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, isEmailVerified: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new AppError(400, 'Email already verified');
    }

    await otpService.resendOTP(userId, user.email, 'VERIFICATION');
  }

  async completeTutorial(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { hasCompletedTutorial: true },
    });
  }
}
