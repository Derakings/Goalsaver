'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users as UsersIcon, Calendar, Banknote, UserPlus, Trash } from 'lucide-react';
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
  const [memberManagementModalOpen, setMemberManagementModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete group');
      toast.success('Group deleted successfully');
      router.push(ROUTES.GROUPS);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete group');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
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
                <Banknote className="w-5 h-5 mr-2 text-green-500" />
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
                    <Banknote className="w-5 h-5 mr-2" />
                    Add Contribution
                  </Button>
                )}
                {isAdmin && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => setMemberManagementModalOpen(true)}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Manage Members
                    </Button>
                    <Button 
                      variant="danger" 
                      size="lg"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <Trash className="w-5 h-5 mr-2" />
                      Delete Group
                    </Button>
                  </>
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

      {/* Member Management Modal */}
      <Modal
        isOpen={memberManagementModalOpen}
        onClose={() => setMemberManagementModalOpen(false)}
        title="Manage Group Members"
        size="lg"
      >
        <div className="space-y-6">
          {/* Share Link Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Invite Members
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Share this link with others to let them join your group:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/groups/${groupId}`}
                className="flex-1 px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-gray-800 text-sm"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/groups/${groupId}`);
                  toast.success('Link copied to clipboard!');
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Current Members ({selectedGroup.members.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.user.firstName[0]}{member.user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge className={member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> Members can join by clicking the shared link or finding your group in the public groups list if it&apos;s set to public.
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Group"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">
              ⚠️ <strong>Warning:</strong> This action cannot be undone. All contributions and group data will be permanently deleted.
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>{selectedGroup.name}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteGroup}
              isLoading={isDeleting}
            >
              Delete Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
