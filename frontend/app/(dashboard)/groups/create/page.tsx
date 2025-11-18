'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useGroups } from '@/hooks/useGroups';
import { ROUTES } from '@/lib/constants';
import toast from 'react-hot-toast';

const createGroupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetAmount: z
    .number()
    .positive('Target amount must be positive')
    .min(1, 'Minimum target is $1'),
  targetItem: z.string().min(3, 'Target item must be at least 3 characters'),
  deadline: z.string().optional(),
  isPublic: z.boolean(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export default function CreateGroupPage() {
  const router = useRouter();
  const { createGroup, loading } = useGroups();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    setError(null);

    try {
      const newGroup = await createGroup(data);
      toast.success('Group created successfully! 🎉');
      router.push(ROUTES.GROUP_DETAIL(newGroup.id));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create group';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href={ROUTES.GROUPS}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Groups
      </Link>

      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900">Create New Group</h1>
          <p className="text-gray-600 mt-2">
            Start a new savings group and invite others to join
          </p>
        </CardHeader>

        <CardBody>
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Group Name"
              placeholder="e.g., Family Vacation Fund"
              error={errors.name?.message}
              {...register('name')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what you're saving for and why..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('targetAmount', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.targetAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.targetAmount.message}</p>
              )}
            </div>

            <Input
              label="Target Item/Goal"
              placeholder="e.g., MacBook Pro, Beach House Rental, Community Garden"
              error={errors.targetItem?.message}
              {...register('targetItem')}
            />

            <Input
              label="Deadline (Optional)"
              type="date"
              error={errors.deadline?.message}
              {...register('deadline')}
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isPublic')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-900">
                Make this group public (anyone can join)
              </label>
            </div>

            <Alert variant="info">
              You will be the admin of this group and can manage its settings.
            </Alert>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                isLoading={loading}
              >
                Create Group
              </Button>
              <Link href={ROUTES.GROUPS}>
                <Button type="button" variant="ghost" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
