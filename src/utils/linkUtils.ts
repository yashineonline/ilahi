export function buildSongUrl(slug: string): string {
    return `${window.location.origin}${import.meta.env.BASE_URL}player/${slug}`
}
  

  


export function getLinkType(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('soundcloud.com')) return 'SoundCloud'
    if (url.includes('drive.google.com')) return 'Google Drive'
    return 'Listen'
}
  
export function isYoutubeLink(url: string): boolean {
    return url ? (url.includes('youtube.com') || url.includes('youtu.be')) : false
}


