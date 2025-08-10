export function getYoutubeLinks(song: { mainLinks?: string[], alternateTunes?: string[] }): string[] {
    const links: string[] = []
    
    if (song.mainLinks) {
      links.push(...song.mainLinks.filter(link => 
        link.includes('youtube.com') || link.includes('youtu.be')
      ))
    }
    
    if (song.alternateTunes) {
      links.push(...song.alternateTunes.filter(link => 
        link.includes('youtube.com') || link.includes('youtu.be')
      ))
    }
    
    return links
  }
  
  export function hasAudioLinks(song: { mainLinks?: string[], alternateTunes?: string[] }): boolean {
    return Boolean((song.mainLinks && song.mainLinks.length > 0) ||
           (song.alternateTunes && song.alternateTunes.length > 0))
  }

  