import React from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          <Link href={ROUTES.CREATE_GROUP} className="block">
            <Button variant="primary" size="lg" className="w-full justify-start">
              <Plus className="w-5 h-5 mr-2" />
              Create New Group
            </Button>
          </Link>
          <Link href={ROUTES.GROUPS} className="block">
            <Button variant="secondary" size="lg" className="w-full justify-start">
              <Search className="w-5 h-5 mr-2" />
              Browse Groups
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
