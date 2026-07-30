import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { SearchType } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    if (format === 'DD/MM/YYYY') {
      return `${day}/${month}/${year}`;
    } else if (format === 'MM/DD/YYYY') {
      return `${month}/${day}/${year}`;
    } else {
      return `${year}-${month}-${day} ${hours}:${mins}`;
    }
  } catch {
    return dateString;
  }
}

export function detectQueryType(query: string): SearchType {
  const trimmed = query.trim();
  if (!trimmed) return 'General';

  // IPv4 / IPv6 pattern
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
  if (ipv4Pattern.test(trimmed) || ipv6Pattern.test(trimmed)) {
    return 'IP';
  }

  // Email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(trimmed)) {
    return 'Email';
  }

  // Domain pattern
  const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (domainPattern.test(trimmed) && !trimmed.includes(' ')) {
    return 'Domain';
  }

  // Username pattern (starts with @ or standard single word)
  if (trimmed.startsWith('@')) {
    return 'Username';
  }

  // Name or Company heuristic
  if (trimmed.toLowerCase().includes('inc') || trimmed.toLowerCase().includes('llc') || trimmed.toLowerCase().includes('corp') || trimmed.toLowerCase().includes('ltd')) {
    return 'Company';
  }

  if (trimmed.split(' ').length <= 3 && !trimmed.includes('.')) {
    return 'Person';
  }

  return 'General';
}

export function validateIp(ip: string): boolean {
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Pattern.test(ip.trim());
}

export function validateDomain(domain: string): boolean {
  const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainPattern.test(domain.trim());
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
