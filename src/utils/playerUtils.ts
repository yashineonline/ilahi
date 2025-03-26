export function getPlayerType(url: string): 'youtube' | 'audio' | 'googledrive' | 'soundcloud' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('drive.google.com')) {
      return 'googledrive';
    } else if (url.includes('soundcloud.com')) {
      return 'soundcloud';
    } else {
      return 'audio';
    }
  }