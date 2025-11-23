/// <reference types="google.accounts" />
import { ref } from 'vue';

const accessToken = ref<string | null>(null);
let tokenClient: google.accounts.oauth2.TokenClient | null = null;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';

export async function getAccessToken(prompt: 'consent' | 'none' = 'consent'): Promise<string> {
  await loadGis();
  ensureClient();
  if (accessToken.value) return accessToken.value;

  return new Promise<string>((resolve, reject) => {
    pendingResolve = resolve;
    try {
      tokenClient!.requestAccessToken({ prompt });
    } catch (e) {
      pendingResolve = null;
      reject(e);
    }
  });
}

export function hasAccessToken() {
  return !!accessToken.value;
}

export function revokeAccessToken() {
  const token = accessToken.value;
  if (!token || !window.google?.accounts?.oauth2?.revoke) return;
  window.google.accounts.oauth2.revoke(token, () => {});
  accessToken.value = null;
}

let pendingResolve: ((t: string) => void) | null = null;

function ensureClient() {
  if (tokenClient || !window.google?.accounts?.oauth2) return;
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (resp) => {
      if ((resp as any).error) {
        console.error('OAuth error:', resp);
        pendingResolve?.('');
        pendingResolve = null;
        return;
      }
      const token = (resp as google.accounts.oauth2.TokenResponse).access_token!;
      accessToken.value = token;                 // <- now definitely string, not null
      pendingResolve?.(token);
      pendingResolve = null;
    },
  });
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
