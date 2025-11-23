import { ensureToken, getToken } from './googleAuth';
import { parseYouTubeUrl } from './youtubeUtils';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

async function ytFetch(path: string, init: RequestInit) {
  await ensureToken(); // prompts the user the first time
  const token = getToken()!;
  const resp = await fetch(`${YT_BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
  return resp.json();
}

export async function createPlaylist(title: string, description = '', privacy: 'private'|'public'|'unlisted' = 'private') {
  return ytFetch('/playlists?part=snippet,status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: { title, description },
      status: { privacyStatus: privacy },
    }),
  }) as Promise<{ id: string }>;
}

export async function addVideoToPlaylist(playlistId: string, videoUrlOrId: string) {
  const { videoId } = parseYouTubeUrl(videoUrlOrId);
  if (!videoId) throw new Error('Bad YouTube link');
  return ytFetch('/playlistItems?part=snippet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: { kind: 'youtube#video', videoId },
      },
    }),
  });
}



// export async function createPlaylist(title: string, token: string) {
//     const r = await fetch(
//       'https://www.googleapis.com/youtube/v3/playlists?part=snippet,status',
//       {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           snippet: { title },
//           status: { privacyStatus: 'private' }
//         })
//       }
//     );
//     if (!r.ok) throw new Error(`Create playlist failed: ${r.status} ${await r.text()}`);
//     const j = await r.json();
//     return j.id as string;
//   }
  
//   export async function addToPlaylist(playlistId: string, videoId: string, token: string) {
//     const r = await fetch(
//       'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
//       {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } }
//         })
//       }
//     );
//     if (!r.ok) throw new Error(`Add item failed: ${r.status} ${await r.text()}`);
//   }
  
//   export async function savePlaylistToYouTube(videoIds: string[], title: string, getToken: () => Promise<string>) {
//     const token = await getToken();                    // from useYouTubeAuth.ts
//     const pid = await createPlaylist(title, token);
//     for (const id of videoIds) await addToPlaylist(pid, id, token);
//     return pid;
//   }
  