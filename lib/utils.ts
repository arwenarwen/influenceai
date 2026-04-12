import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    NANO: 'Nano (1K–10K)',
    MICRO: 'Micro (10K–100K)',
    MID: 'Mid (100K–500K)',
    MACRO: 'Macro (500K–1M)',
    MEGA: 'Mega (1M+)',
  };
  return labels[tier] || tier;
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    NANO: 'bg-gray-100 text-gray-700',
    MICRO: 'bg-blue-100 text-blue-700',
    MID: 'bg-green-100 text-green-700',
    MACRO: 'bg-orange-100 text-orange-700',
    MEGA: 'bg-purple-100 text-purple-700',
  };
  return colors[tier] || 'bg-gray-100 text-gray-700';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    DECLINED: 'bg-red-100 text-red-700',
    NEGOTIATING: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-green-100 text-green-700',
    DRAFT: 'bg-gray-100 text-gray-700',
    MATCHING: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    TIKTOK: '🎵',
    INSTAGRAM: '📸',
    YOUTUBE: '▶️',
    TWITTER: '🐦',
    TWITCH: '🎮',
    LINKEDIN: '💼',
    SNAPCHAT: '👻',
    PINTEREST: '📌',
  };
  return icons[platform] || '🌐';
}
