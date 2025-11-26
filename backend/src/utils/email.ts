import { createTransport } from 'nodemailer';
import { config } from '../config/database';
import { EmailOptions } from '../types';
import { logger } from './logger';

// Create reusable transporter
const createTransporter = () => {
  // Use real SMTP credentials if configured
  if (config.smtp.host && config.smtp.host !== 'smtp.example.com') {
    return createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  // If SMTP not configured, log instead of sending
  return null;
};

const transporter = createTransporter();

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!transporter) {
      // In development, just log the email
      logger.info('Email would be sent (development mode):', {
        to: options.to,
        subject: options.subject,
        text: options.text.substring(0, 100),
      });
      return true;
    }

    const mailOptions = {
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  welcome: (firstName: string) => ({
    subject: 'Welcome to Goalsaver!',
    text: `Hi ${firstName},\n\nWelcome to Goalsaver! Start saving with your community today.\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>Welcome to Goalsaver! Start saving with your community today.</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  groupCreated: (firstName: string, groupName: string, targetItem: string) => ({
    subject: `Group "${groupName}" created successfully!`,
    text: `Hi ${firstName},\n\nYour savings group "${groupName}" for ${targetItem} has been created successfully! You can now invite members and start contributing.\n\nBest regards,\nThe Goalsaver Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Group Created!</h1>
        </div>
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
          <p style="color: #666; font-size: 16px;">Your savings group has been created successfully!</p>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px;">${groupName}</h3>
            <p style="margin: 0; opacity: 0.9;">Target: ${targetItem}</p>
          </div>
          <p style="color: #666; font-size: 16px;">You can now invite members and start contributing towards your goal!</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2025 Goalsaver. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  groupJoined: (firstName: string, groupName: string) => ({
    subject: `You joined ${groupName}`,
    text: `Hi ${firstName},\n\nYou have successfully joined the group "${groupName}". Start contributing towards your goal!\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>You have successfully joined the group "${groupName}". Start contributing towards your goal!</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  newMemberJoined: (firstName: string, groupName: string, newMemberName: string) => ({
    subject: `New member joined ${groupName}`,
    text: `Hi ${firstName},\n\n${newMemberName} has joined your group "${groupName}".\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>${newMemberName} has joined your group "${groupName}".</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  contributionMade: (firstName: string, groupName: string, amount: string, contributor: string) => ({
    subject: `New contribution to ${groupName}`,
    text: `Hi ${firstName},\n\n${contributor} contributed ${amount} to "${groupName}".\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>${contributor} contributed ${amount} to "${groupName}".</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  targetMilestone: (firstName: string, groupName: string, percentage: number) => ({
    subject: `${groupName} reached ${percentage}% of target!`,
    text: `Hi ${firstName},\n\nGreat news! "${groupName}" has reached ${percentage}% of its target goal.\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>Great news! "${groupName}" has reached ${percentage}% of its target goal.</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  targetReached: (firstName: string, groupName: string) => ({
    subject: `🎉 ${groupName} reached its target!`,
    text: `Hi ${firstName},\n\nCongratulations! "${groupName}" has reached its target goal. The purchase process will begin shortly.\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>Congratulations! "${groupName}" has reached its target goal. The purchase process will begin shortly.</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  purchaseInitiated: (firstName: string, groupName: string) => ({
    subject: `Purchase initiated for ${groupName}`,
    text: `Hi ${firstName},\n\nThe purchase process has been initiated for "${groupName}". We'll notify you once it's completed.\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>The purchase process has been initiated for "${groupName}". We'll notify you once it's completed.</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  purchaseCompleted: (firstName: string, groupName: string) => ({
    subject: `✅ Purchase completed for ${groupName}`,
    text: `Hi ${firstName},\n\nThe purchase for "${groupName}" has been completed successfully!\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>The purchase for "${groupName}" has been completed successfully!</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),

  otpVerification: (otp: string) => ({
    subject: 'Verify Your Email - Goalsaver',
    text: `Your verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Goalsaver Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Goalsaver</h1>
        </div>
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
          <p style="color: #666; font-size: 16px;">Enter this code to verify your email address:</p>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 30px 0;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 5 minutes</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2025 Goalsaver. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (otp: string) => ({
    subject: 'Reset Your Password - Goalsaver',
    text: `Your password reset code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Goalsaver Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Goalsaver</h1>
        </div>
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; font-size: 16px;">Use this code to reset your password:</p>
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 30px 0;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 5 minutes</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2025 Goalsaver. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  newLogin: (firstName: string, deviceInfo: string, location: string) => ({
    subject: 'New Login to Your Goalsaver Account',
    text: `Hi ${firstName},\n\nWe detected a new login to your account.\n\nDevice: ${deviceInfo}\nLocation: ${location}\nTime: ${new Date().toLocaleString()}\n\nIf this wasn't you, please secure your account immediately.\n\nBest regards,\nThe Goalsaver Team`,
    html: `<h2>Hi ${firstName},</h2><p>We detected a new login to your account.</p><p><strong>Device:</strong> ${deviceInfo}<br><strong>Location:</strong> ${location}<br><strong>Time:</strong> ${new Date().toLocaleString()}</p><p>If this wasn't you, please secure your account immediately.</p><p>Best regards,<br>The Goalsaver Team</p>`,
  }),
};
