// src/utils/youtubeUtils.ts

// export interface YouTubeInfo {
//     videoId: string;
//     startTime: number;
//     endTime: number;
//   }
  
  export function parseYouTubeUrl(input: string){
    if (!input) return { videoId:'', startTime:0, endTime:0 };
    const bare = /^[a-zA-Z0-9_-]{11}$/;
    if (bare.test(input)) return { videoId: input, startTime:0, endTime:0 };
  
    try {
      const u = new URL(input);
      const sp = u.searchParams;
      // watch?v=
      if (sp.get('v')) return { videoId: sp.get('v')!, startTime: parseT(sp.get('t')||sp.get('start')), endTime: parseT(sp.get('end')) };
      // youtu.be/<id>
      const m1 = u.hostname.includes('youtu.be') && u.pathname.slice(1).match(bare);
      if (m1) return { videoId: u.pathname.slice(1, 12), startTime: parseT(sp.get('t')||sp.get('start')), endTime: parseT(sp.get('end')) };
      // /embed/<id>, /shorts/<id>, /live/<id>
      const m2 = u.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (m2) return { videoId: m2[2], startTime: parseT(sp.get('t')||sp.get('start')), endTime: parseT(sp.get('end')) };
    } catch {}
    return { videoId:'', startTime:0, endTime:0 };
  
    function parseT(v: string|null){
      if (!v) return 0;
      if (/^\d+$/.test(v)) return +v;
      const m = v.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
      const h = +(m?.[1]||0), m2 = +(m?.[2]||0), s = +(m?.[3]||0);
      return h*3600 + m2*60 + s;
    }
  }
  

  /**
   * Robust YouTube URL parser.
   * Accepts full URLs (watch, youtu.be, embed) or bare video IDs.
   */
  // export function parseYouTubeUrl(input: string): YouTubeInfo {
  //   if (!input) {
  //     return { videoId: '', startTime: 0, endTime: 0 };
  //   }
  
  //   // If it's already “bare” and 11 chars, just treat as ID
  //   if (!input.startsWith('http') && input.length === 11 && !input.includes(' ')) {
  //     return { videoId: input, startTime: 0, endTime: 0 };
  //   }
  
    // let url: URL;
  //   try {
  //     url = new URL(input);
  //   } catch {
  //     // Fallback: treat as ID
  //     return { videoId: input, startTime: 0, endTime: 0 };
  //   }
  
  //   let videoId = '';
  //   const host = url.hostname;
  //   const path = url.pathname;
  
  //   if (host.includes('youtu.be')) {
  //     // https://youtu.be/VIDEOID
  //     videoId = path.slice(1);
  //   } else if (path === '/watch') {
  //     // https://www.youtube.com/watch?v=VIDEOID
  //     videoId = url.searchParams.get('v') ?? '';
  //   } else if (path.startsWith('/embed/') || path.startsWith('/v/')) {
  //     // /embed/VIDEOID or /v/VIDEOID
  //     const parts = path.split('/');
  //     videoId = parts[2] ?? '';
  //   }
  
    // const parseTimeParam = (value: string | null): number => {
    //   if (!value) return 0;
    //   if (/^\d+$/.test(value)) return parseInt(value, 10);
  
    //   // Handle formats like 1h2m3s
    //   const m = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    //   if (!m) return 0;
    //   const [, h, mStr, s] = m;
    //   return (
    //     (parseInt(h || '0', 10) * 3600) +
    //     (parseInt(mStr || '0', 10) * 60) +
    //     parseInt(s || '0', 10)
    //   );
    // };
  
  //   const startTime = parseTimeParam(url.searchParams.get('t') ?? url.searchParams.get('start'));
  //   const endTime = parseTimeParam(url.searchParams.get('end'));
  
  //   return { videoId, startTime, endTime };
  // }
  