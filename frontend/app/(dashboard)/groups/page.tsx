'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { GroupCard } from '@/components/groups/GroupCard';
import { Button } from '@/components/ui/Button';
import { useGroups } from '@/hooks/useGroups';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/lib/constants';
import type { Group } from '@/types';

export default function GroupsPage() {
  const { groups, fetchGroups, loading } = useGroups();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<'my-groups' | 'all-groups'>('my-groups');

  useEffect(() => {
    const myGroupsOnly = activeTab === 'my-groups';
    fetchGroups(myGroupsOnly).catch((error) => {
      console.error('Failed to fetch groups:', error);
    });
  }, [activeTab]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.targetItem.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchTerm, groups]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Browse Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join a group and start saving together
          </p>
        </div>
        <Link href={ROUTES.CREATE_GROUP}>
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Group
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('my-groups')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'my-groups'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          My Groups
        </button>
        <button
          onClick={() => setActiveTab('all-groups')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'all-groups'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Discover Groups
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search groups by name, description, or target item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" className="text-blue-600" />
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-xl text-gray-900 dark:text-gray-100 font-semibold mb-2">
            {searchTerm ? 'No groups found' : 'No groups yet'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Be the first to create a group!'}
          </p>
          {!searchTerm && (
            <Link href={ROUTES.CREATE_GROUP}>
              <Button variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Group
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
