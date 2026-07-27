import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateHash(hash: string, length: number = 8): string {
  if (!hash) return '';
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'allowed':
    case 'completed':
    case 'resolved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'paused':
    case 'investigating':
    case 'conditional':
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'quarantined':
    case 'suspended':
    case 'emergency_stopped':
    case 'denied':
    case 'critical':
    case 'high':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}
