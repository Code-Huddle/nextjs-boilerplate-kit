// Cookie utility functions for auth-supabase-roles module

export const COOKIE_NAMES = {
  USER_ROLE: 'userRole',
  USER_ID: 'userId',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
} as const;

export const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: false, // Allow client-side access for role checks
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
} as const;

// Client-side cookie functions
export const setCookie = (name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>) => {
  if (typeof window === 'undefined') return;
  
  const cookieOptions = { ...COOKIE_OPTIONS, ...options };
  const expires = new Date(Date.now() + cookieOptions.maxAge * 1000).toUTCString();
  
  document.cookie = `${name}=${value}; expires=${expires}; path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}${cookieOptions.secure ? '; Secure' : ''}`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// User data cookie functions
export const setUserData = (userData: {
  role: string;
  id: string;
  email: string;
  name?: string;
}) => {
  setCookie(COOKIE_NAMES.USER_ROLE, userData.role);
  setCookie(COOKIE_NAMES.USER_ID, userData.id);
  setCookie(COOKIE_NAMES.USER_EMAIL, userData.email);
  if (userData.name) {
    setCookie(COOKIE_NAMES.USER_NAME, userData.name);
  }
};

export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  const role = getCookie(COOKIE_NAMES.USER_ROLE);
  const id = getCookie(COOKIE_NAMES.USER_ID);
  const email = getCookie(COOKIE_NAMES.USER_EMAIL);
  const name = getCookie(COOKIE_NAMES.USER_NAME);
  
  if (!role || !id || !email) return null;
  
  return {
    role,
    id,
    email,
    name: name || undefined,
  };
};

export const clearUserData = () => {
  deleteCookie(COOKIE_NAMES.USER_ROLE);
  deleteCookie(COOKIE_NAMES.USER_ID);
  deleteCookie(COOKIE_NAMES.USER_EMAIL);
  deleteCookie(COOKIE_NAMES.USER_NAME);
};
