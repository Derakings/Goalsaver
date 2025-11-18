'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useGroups } from '@/hooks/useGroups';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const contributionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(1, 'Minimum contribution is $1'),
  note: z.string().optional(),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  groupId: string;
  remainingAmount: number;
  onSuccess: () => void;
}

export function ContributionForm({
  groupId,
  remainingAmount,
  onSuccess,
}: ContributionFormProps) {
  const { addContribution, loading } = useGroups();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  });

  const onSubmit = async (data: ContributionFormData) => {
    setError(null);

    if (data.amount > remainingAmount) {
      setError(
        `Amount exceeds remaining target (${formatCurrency(remainingAmount)})`
      );
      return;
    }

    try {
      await addContribution(groupId, data);
      toast.success('Contribution added successfully! 🎉');
      reset();
      onSuccess();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add contribution';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contribution Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Remaining: {formatCurrency(remainingAmount)}
        </p>
      </div>

      {/* Note Input (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Note (Optional)
        </label>
        <textarea
          {...register('note')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Add a note to your contribution..."
        />
        {errors.note && (
          <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>
        )}
      </div>

      {/* Payment Method Info */}
      <Alert variant="info">
        Payment processing is currently in mock mode. No actual charges will be made.
      </Alert>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={loading}
      >
        Contribute Now
      </Button>
    </form>
  );
}
