import nodemailer from 'nodemailer';
import { config } from '../config/database';
import { EmailOptions } from '../types';
import { logger } from './logger';

// Create reusable transporter
const createTransporter = () => {
  // In production, use real SMTP credentials
  // For development, create a test account
  if (config.nodeEnv === 'production' && config.smtp.host) {
    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  // For development/testing, log instead of sending
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
};
