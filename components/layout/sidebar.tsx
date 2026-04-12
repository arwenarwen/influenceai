'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Zap, LayoutDashboard, Users, Megaphone, BarChart3, Bell, Settings,
  LogOut, User, Briefcase, Bot, FileText, DollarSign, Search, Target,
  ShieldCheck, Sliders
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarItem = { href: string; label: string; icon: React.ElementType; badge?: number };

const CREATOR_NAV: SidebarItem[] = [
  { href: '/creator', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/creator/collaborations', label: 'Collaborations', icon: Briefcase },
  { href: '/creator/profile', label: 'My Profile', icon: User },
  { href: '/creator/portfolio', label: 'Portfolio', icon: FileText },
  { href: '/creator/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/creator/notifications', label: 'Notifications', icon: Bell },
];

const BRAND_NAV: SidebarItem[] = [
  { href: '/brand', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brand/search', label: 'Find Creators', icon: Search },
  { href: '/brand/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/brand/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/brand/notifications', label: 'Notifications', icon: Bell },
];

const ADMIN_NAV: SidebarItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/campaigns', label: 'All Campaigns', icon: Megaphone },
  { href: '/admin/matches', label: 'AI Matches', icon: Bot },
  { href: '/admin/discovery', label: 'Discovery', icon: Target },
  { href: '/admin/creators', label: 'Creators', icon: Users },
  { href: '/admin/brands', label: 'Brands', icon: Briefcase },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'AI Settings', icon: Sliders },
];

interface SidebarProps {
  role: 'CREATOR' | 'BRAND' | 'ADMIN';
  userName?: string;
  userEmail?: string;
  userImage?: string;
  notificationCount?: number;
}

export function Sidebar({ role, userName, userEmail, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const nav = role === 'CREATOR' ? CREATOR_NAV : role === 'BRAND' ? BRAND_NAV : ADMIN_NAV;

  const roleConfig = {
    CREATOR: { label: 'Creator', color: 'from-purple-500 to-pink-500', icon: Users },
    BRAND: { label: 'Brand', color: 'from-blue-500 to-cyan-500', icon: Briefcase },
    ADMIN: { label: 'Admin', color: 'from-orange-500 to-amber-500', icon: ShieldCheck },
  }[role];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-purple-pink flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">InfluenceHub</span>
        </Link>
        <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${roleConfig.color} text-white text-xs font-medium`}>
          <roleConfig.icon className="h-3 w-3" />
          {roleConfig.label}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/creator' && item.href !== '/brand' && item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
              <item.icon className={cn('h-4 w-4', isActive ? 'text-purple-600' : 'text-gray-400')} />
              {item.label}
              {item.label === 'Notifications' && notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        <Link href={role === 'CREATOR' ? '/creator/settings' : role === 'BRAND' ? '/brand/settings' : '/admin/settings'}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">
          <Settings className="h-4 w-4 text-gray-400" />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full gradient-purple-pink flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 text-sm truncate">{userName || 'User'}</div>
            <div className="text-xs text-gray-500 truncate">{userEmail}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
