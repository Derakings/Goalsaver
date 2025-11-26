'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { authApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const userId = searchParams.get('userId') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!email || !userId) {
      router.push(ROUTES.REGISTER);
    }
  }, [email, userId, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    setError(null);

    try {
      await authApi.verifyOTP(userId, otp);
      toast.success('Email verified successfully! 🎉');
      router.push(ROUTES.LOGIN + '?verified=true');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Invalid or expired OTP';
      setError(message);
      toast.error(message);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);

    try {
      await authApi.resendOTP(userId);
      toast.success('New OTP sent to your email!');
      setResendTimer(60); // 60 seconds cooldown
      setOtp('');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to resend OTP';
      setError(message);
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href={ROUTES.REGISTER}
          className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Register
        </Link>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400 text-center mb-8">
            We sent a 6-digit code to <br />
            <span className="font-medium text-blue-400">{email}</span>
          </p>

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* OTP Input */}
          <div className="mb-8">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
            />
          </div>

          {/* Info */}
          <p className="text-sm text-gray-400 text-center mb-6">
            Enter the code above to verify your email address
          </p>

          {/* Verify Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-4"
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            isLoading={loading}
          >
            Verify Email
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              Didn't receive the code?
            </p>
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend available in {resendTimer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}
