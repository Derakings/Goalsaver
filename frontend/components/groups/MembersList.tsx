import React from 'react';
import { Shield, User } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';
import type { GroupMember } from '@/types';

interface MembersListProps {
  members: GroupMember[];
}

export function MembersList({ members }: MembersListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Members ({members.length})
      </h3>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(member.user.firstName, member.user.lastName)}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">
                    {member.user.firstName} {member.user.lastName}
                  </p>
                  {member.role === 'ADMIN' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Joined {formatDate(member.joinedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No members yet</p>
        </div>
      )}
    </div>
  );
}
