// src/utils/googleAuth.ts
/// <reference types="google.accounts" />

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';

export function hasToken() { return !!accessToken; }
export function getToken() { return accessToken; }

export async function ensureToken(prompt: 'none' | 'consent' = 'consent'): Promise<string> {
  await loadGis();
  initTokenClient();
  if (accessToken) return accessToken;
  return new Promise<string>((resolve) => {
    pendingResolve = resolve;
    tokenClient!.requestAccessToken({ prompt });
  });
}

let pendingResolve: ((t: string) => void) | null = null;

function initTokenClient() {
  if (tokenClient || !window.google?.accounts?.oauth2) return;
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (resp) => {
      // Narrow to a definite string before using
      if ((resp as any).error) {
        console.error('OAuth error:', resp);
        pendingResolve?.('');
        pendingResolve = null;
        return;
      }
      const token = (resp as google.accounts.oauth2.TokenResponse).access_token!;
      accessToken = token;
      pendingResolve?.(token);   // <- pass the definite string, not union
      pendingResolve = null;
    },
  });
}

export function revokeToken() {
  if (!accessToken || !window.google?.accounts?.oauth2?.revoke) return;
  const token = accessToken;     // narrow to string
  window.google.accounts.oauth2.revoke(token, () => {});
  accessToken = null;
}

function loadGis(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const src = 'https://accounts.google.com/gsi/client';
    let s = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (!s) {
      s = document.createElement('script');
      s.src = src; s.async = true; s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(s);
    } else {
      s.addEventListener('load', () => resolve(), { once: true });
      s.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')), { once: true });
    }
  });
}
