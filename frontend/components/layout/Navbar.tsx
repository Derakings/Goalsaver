'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();

  const navLinks = isAuthenticated
    ? [
        { href: ROUTES.DASHBOARD, label: 'Dashboard' },
        { href: ROUTES.GROUPS, label: 'Groups' },
        { href: ROUTES.NOTIFICATIONS, label: 'Notifications' },
      ]
    : [];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex">
            <Link href={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">{APP_NAME}</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  {link.label}
                  {link.href === ROUTES.NOTIFICATIONS && unreadCount > 0 && (
                    <Badge variant="danger" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  href={ROUTES.NOTIFICATIONS}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden md:block text-sm font-medium">
                      {user?.firstName}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                        <Link
                          href={ROUTES.PROFILE}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href={ROUTES.LOGIN}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-4 p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive(link.href)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
