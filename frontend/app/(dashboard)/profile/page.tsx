'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setError(null);
    try {
      // TODO: Implement profile update API call
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setError(null);
    try {
      // TODO: Implement password change API call
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to change password';
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      try {
        // TODO: Implement account deletion API call
        toast.success('Account deleted successfully');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to delete account';
        toast.error(message);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {/* Avatar */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="ml-6">
              <p className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  error={profileErrors.firstName?.message}
                  {...registerProfile('firstName')}
                />
                <Input
                  label="Last Name"
                  error={profileErrors.lastName?.message}
                  {...registerProfile('lastName')}
                />
              </div>
              <Input
                label="Email"
                type="email"
                error={profileErrors.email?.message}
                {...registerProfile('email')}
              />
              <Input
                label="Phone"
                type="tel"
                error={profileErrors.phone?.message}
                {...registerProfile('phone')}
              />
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-3 text-gray-400" />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            <Input
              label="New Password"
              type="password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
            <Button type="submit" variant="primary">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Notification Settings
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive email updates about your groups
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
