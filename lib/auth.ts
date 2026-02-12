import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'bbp_admin';

export function isAdminAuthed() {
  return cookies().get(ADMIN_COOKIE)?.value === '1';
}

export function setAdminCookie() {
  cookies().set(ADMIN_COOKIE, '1', { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE);
}
