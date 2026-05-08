import type { AuthUser } from './types';
const AUTH_USER_KEY = 'nte_auth_user_v1';
function isStorageAvailable(): boolean { if (typeof window === 'undefined') return false; try { const key='__nte_auth_test__'; window.localStorage.setItem(key,'1'); window.localStorage.removeItem(key); return true; } catch { return false; } }
export function readAuthUser(): AuthUser | null { if (!isStorageAvailable()) return null; try { const raw = window.localStorage.getItem(AUTH_USER_KEY); return raw ? (JSON.parse(raw) as AuthUser) : null; } catch { return null; } }
export function writeAuthUser(user: AuthUser | null): void { if (!isStorageAvailable()) return; if (!user) { window.localStorage.removeItem(AUTH_USER_KEY); return; } window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)); }
