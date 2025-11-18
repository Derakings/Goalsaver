'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { groupsApi, contributionsApi } from '@/lib/api';
import type { Group, Contribution, CreateGroupData, ContributionData } from '@/types';

interface GroupContextType {
  selectedGroup: Group | null;
  groups: Group[];
  contributions: Contribution[];
  loading: boolean;
  fetchGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<void>;
  createGroup: (data: CreateGroupData) => Promise<Group>;
  updateGroup: (id: string, data: Partial<CreateGroupData>) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
  joinGroup: (id: string) => Promise<void>;
  leaveGroup: (id: string) => Promise<void>;
  fetchContributions: (groupId: string) => Promise<void>;
  addContribution: (groupId: string, data: ContributionData) => Promise<Contribution>;
  clearSelectedGroup: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchGroup = async (id: string) => {
    setLoading(true);
    try {
      const data = await groupsApi.getById(id);
      setSelectedGroup(data);
    } catch (error) {
      console.error('Failed to fetch group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data: CreateGroupData) => {
    setLoading(true);
    try {
      const newGroup = await groupsApi.create(data);
      setGroups((prev) => [...prev, newGroup]);
      return newGroup;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: string, data: Partial<CreateGroupData>) => {
    setLoading(true);
    try {
      const updatedGroup = await groupsApi.update(id, data);
      setGroups((prev) =>
        prev.map((group) => (group.id === id ? updatedGroup : group))
      );
      if (selectedGroup?.id === id) {
        setSelectedGroup(updatedGroup);
      }
      return updatedGroup;
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    setLoading(true);
    try {
      await groupsApi.delete(id);
      setGroups((prev) => prev.filter((group) => group.id !== id));
      if (selectedGroup?.id === id) {
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (id: string) => {
    setLoading(true);
    try {
      await groupsApi.join(id);
      await fetchGroup(id);
      await fetchGroups();
    } catch (error) {
      console.error('Failed to join group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (id: string) => {
    setLoading(true);
    try {
      await groupsApi.leave(id);
      await fetchGroups();
      if (selectedGroup?.id === id) {
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('Failed to leave group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async (groupId: string) => {
    setLoading(true);
    try {
      const data = await contributionsApi.getByGroup(groupId);
      setContributions(data);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addContribution = async (groupId: string, data: ContributionData) => {
    setLoading(true);
    try {
      const newContribution = await contributionsApi.create(groupId, data);
      setContributions((prev) => [newContribution, ...prev]);
      // Refresh group to update progress
      await fetchGroup(groupId);
      return newContribution;
    } catch (error) {
      console.error('Failed to add contribution:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedGroup = () => {
    setSelectedGroup(null);
    setContributions([]);
  };

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        groups,
        contributions,
        loading,
        fetchGroups,
        fetchGroup,
        createGroup,
        updateGroup,
        deleteGroup,
        joinGroup,
        leaveGroup,
        fetchContributions,
        addContribution,
        clearSelectedGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}
