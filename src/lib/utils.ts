import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a notification timestamp, ISO string, epoch number, or ID into a valid Date object.
 */
export function parseNotificationDate(
  timestamp?: string | number | null,
  fallbackIdOrDate?: string | number | null
): Date | null {
  // 1. If timestamp is a valid number / epoch
  if (typeof timestamp === 'number' && !isNaN(timestamp) && timestamp > 0) {
    return new Date(timestamp);
  }

  // 2. If timestamp is a string
  if (typeof timestamp === 'string' && timestamp.trim()) {
    const trimmed = timestamp.trim();

    // If it's NOT the static placeholder "Just now"
    if (trimmed.toLowerCase() !== 'just now') {
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) {
        return new Date(parsed);
      }

      // Check for relative strings like "10 minutes ago", "2 hours ago", "5 hours ago", "Yesterday..."
      const minMatch = trimmed.match(/^(\d+)\s+min(?:ute)?s?\s+ago$/i);
      if (minMatch) {
        return new Date(Date.now() - parseInt(minMatch[1], 10) * 60 * 1000);
      }
      const hourMatch = trimmed.match(/^(\d+)\s+hours?\s+ago$/i);
      if (hourMatch) {
        return new Date(Date.now() - parseInt(hourMatch[1], 10) * 3600 * 1000);
      }
      const dayMatch = trimmed.match(/^(\d+)\s+days?\s+ago$/i);
      if (dayMatch) {
        return new Date(Date.now() - parseInt(dayMatch[1], 10) * 86400 * 1000);
      }
      if (/^yesterday/i.test(trimmed)) {
        return new Date(Date.now() - 86400 * 1000);
      }
    }
  }

  // 3. Try fallbackIdOrDate (which could be createdAt, an ISO string, or an ID like notif-1726829871234)
  if (typeof fallbackIdOrDate === 'number' && !isNaN(fallbackIdOrDate) && fallbackIdOrDate > 0) {
    return new Date(fallbackIdOrDate);
  }

  if (typeof fallbackIdOrDate === 'string' && fallbackIdOrDate.trim()) {
    const trimmed = fallbackIdOrDate.trim();
    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) {
      return new Date(parsed);
    }
    // Check if ID contains a timestamp: e.g. "notif-1726829871234"
    const match = trimmed.match(/(?:notif|sub|alert)-(\d{13})/i);
    if (match) {
      const ts = parseInt(match[1], 10);
      if (!isNaN(ts) && ts > 1600000000000) {
        return new Date(ts);
      }
    }
  }

  return null;
}

/**
 * Formats a notification date into a live human-readable relative time (e.g. "Just now", "5 minutes ago", "Yesterday at 3:45 PM").
 */
export function formatTimeAgo(
  timestamp?: string | number | null,
  fallbackIdOrDate?: string | number | null
): string {
  const date = parseNotificationDate(timestamp, fallbackIdOrDate);
  if (!date) {
    // If not a parseable date but has a non-empty string other than "Just now", return it
    if (typeof timestamp === 'string' && timestamp.trim() && timestamp.trim().toLowerCase() !== 'just now') {
      return timestamp.trim();
    }
    return 'Just now';
  }

  const now = Date.now();
  const diffMs = now - date.getTime();

  // If clock skew or within the last 45 seconds
  if (diffMs < 45 * 1000 && diffMs > -60 * 1000) {
    return 'Just now';
  }

  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) {
    return 'Just now';
  }

  if (diffMin === 1) {
    return '1 minute ago';
  }

  if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  }

  if (diffHours === 1) {
    return '1 hour ago';
  }

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  if (diffDays === 1) {
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `Yesterday at ${timeStr}`;
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Format as "MMM d, yyyy"
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
