// ============================================================
// OAUTH / LOGIN CONFIGURATION
// ============================================================
// Set these environment variables when ready to enable login:
//   VITE_OAUTH_PORTAL_URL — your OAuth provider URL
//   VITE_APP_ID — your app's OAuth client ID
//
// Until configured, getLoginUrl() returns "#" so the site
// loads without crashing (no TypeError: Invalid URL).
// ============================================================

export const COOKIE_NAME = 'ns_session';
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Generate login URL at runtime so redirect URI reflects the current origin.
 * Returns "#" when OAuth is not configured so the site loads without crashing.
 */
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  if (!oauthPortalUrl || oauthPortalUrl === 'placeholder') return '#';

  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set('appId', appId);
  url.searchParams.set('redirectUri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('type', 'signIn');

  return url.toString();
};

/**
 * Check if user is logged in by looking for session cookie.
 */
export const isLoggedIn = () => {
  return document.cookie.split(';').some(c => c.trim().startsWith(`${COOKIE_NAME}=`));
};

/**
 * Get session token from cookie.
 */
export const getSessionToken = () => {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
};

/**
 * Clear session (logout).
 */
export const logout = () => {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  window.location.href = '/';
};

/**
 * Check if OAuth is configured.
 */
export const isOAuthConfigured = () => {
  const url = import.meta.env.VITE_OAUTH_PORTAL_URL;
  return url && url !== 'placeholder';
};
