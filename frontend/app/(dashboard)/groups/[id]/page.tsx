'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users as UsersIcon, Calendar, DollarSign } from 'lucide-react';
import { GroupProgress } from '@/components/groups/GroupProgress';
import { MembersList } from '@/components/groups/MembersList';
import { ContributionTimeline } from '@/components/groups/ContributionTimeline';
import { ContributionForm } from '@/components/groups/ContributionForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, getDaysUntilDeadline } from '@/lib/utils';
import { GROUP_STATUS_LABELS, GROUP_STATUS_COLORS, ROUTES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedGroup, contributions, fetchGroup, fetchContributions, joinGroup, loading } =
    useGroups();
  const [contributionModalOpen, setContributionModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const groupId = params.id as string;

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId).catch((error) => {
        console.error('Failed to fetch group:', error);
        toast.error('Failed to load group details');
        router.push(ROUTES.GROUPS);
      });
      fetchContributions(groupId).catch((error) => {
        console.error('Failed to fetch contributions:', error);
      });
    }
  }, [groupId]);

  const handleJoinGroup = async () => {
    setIsJoining(true);
    try {
      await joinGroup(groupId);
      toast.success('Successfully joined the group! 🎉');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to join group';
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleContributionSuccess = () => {
    setContributionModalOpen(false);
    fetchGroup(groupId);
    fetchContributions(groupId);
  };

  if (loading || !selectedGroup) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  const isMember = selectedGroup.members.some((member) => member.userId === user?.id);
  const isAdmin = selectedGroup.members.some(
    (member) => member.userId === user?.id && member.role === 'ADMIN'
  );
  const daysUntil = getDaysUntilDeadline(selectedGroup.deadline);
  const statusColor = GROUP_STATUS_COLORS[selectedGroup.status];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href={ROUTES.GROUPS}
        className="inline-flex items-center text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Groups
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{selectedGroup.name}</h1>
              <Badge className={statusColor}>
                {GROUP_STATUS_LABELS[selectedGroup.status]}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg mb-6">{selectedGroup.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-blue-500" />
                <span>{selectedGroup.members.length} members</span>
              </div>
              {selectedGroup.deadline && daysUntil !== null && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                  <span>
                    {daysUntil >= 0
                      ? `${daysUntil} days remaining`
                      : `Ended ${formatDate(selectedGroup.deadline)}`}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                <span>Created {formatDate(selectedGroup.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isMember ? (
              <>
                {selectedGroup.status === 'SAVING' && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setContributionModalOpen(true)}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Add Contribution
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="secondary" size="lg">
                    Manage Group
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleJoinGroup}
                isLoading={isJoining}
              >
                Join Group
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <GroupProgress group={selectedGroup} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contribution Timeline */}
        <div className="lg:col-span-2">
          <ContributionTimeline contributions={contributions} />
        </div>

        {/* Right Column - Members List */}
        <div>
          <MembersList members={selectedGroup.members} />
        </div>
      </div>

      {/* Contribution Modal */}
      <Modal
        isOpen={contributionModalOpen}
        onClose={() => setContributionModalOpen(false)}
        title="Add Contribution"
        size="md"
      >
        <ContributionForm
          groupId={groupId}
          remainingAmount={selectedGroup.targetAmount - selectedGroup.currentAmount}
          onSuccess={handleContributionSuccess}
        />
      </Modal>
    </div>
  );
}
