// src/lib/auth.ts
import type { User } from 'firebase/auth';

const ADMIN_EMAIL = 'philbogle@gmail.com';

/**
 * Checks if a user is an administrator.
 * @param user The user object from Firebase Auth.
 * @returns True if the user is an admin, false otherwise.
 */
export function isAdmin(user: User | null): boolean {
  if (!user) {
    return false;
  }
  return user.email === ADMIN_EMAIL;
}
