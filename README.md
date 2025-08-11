

# ilahi Book App - Poetry and Ottoman History Platform

## Overview

The ilahi Book App is a comprehensive Progressive Web Application (PWA) designed to serve poetry, historic content and texts to users worldwide. Built with modern web technologies, it provides an accessible, offline-capable platform for singing practices.

## Technical Architecture

### Frontend Framework
- **Vue 3** with Composition API for reactive, component-based architecture
- **TypeScript** for type safety and enhanced developer experience
- **Pinia** for state management across multiple stores (songs, poems, settings, navigation, theme)
- **Vue Router** for client-side navigation with deep linking support

### Styling & UI
- **Tailwind CSS** for utility-first styling and responsive design
- **DaisyUI** for pre-built, accessible UI components
- **FontAwesome** for consistent iconography
- **Custom CSS** for specialized components and animations

### Build & Development
- **Vite** for fast development and optimized production builds
- **Rollup** with manual chunk splitting for optimal bundle sizes
- **PWA** capabilities via `vite-plugin-pwa` and Workbox
- **Service Workers** for offline functionality and caching

### Content Management
- **GitHub API** integration for dynamic content discovery
- **Firebase** (Firestore & Storage) for book metadata and file management
- **localStorage** for user preferences and offline caching
- **Intelligent caching** strategies for performance optimization

## Core Features

### Content Types
1. **Ilahi (Ottoman Songs, mostly in Turkish)** - Main collection with translations and audio links
2. **Naat (Poetry mostly in Urdu)** - Dedicated section for poetry
3. **Poems** - Multi-author poetry collection with dynamic discovery
4. **Books** - PDF generation and management system
5. **Quotes** - Inspirational quotes and wisdom

### Advanced Functionality

#### Dynamic Content Discovery
- Automatic file detection using GitHub API
- Handles non-consecutive file numbering (e.g., poem-1,2,3,4,12,13,14,15,16)
- Real-time content updates without app redeployment
- Intelligent caching with force refresh capabilities

#### Hyperlink System
- Custom markdown-like parser for internal navigation
- `$slug` syntax for song/poem links with automatic type detection
- `£url|text` for external links with custom display text
- `##bold text##` formatting for emphasis
- Cross-content linking between different data files

#### User Experience Features
- **Side-by-side translation layout** with persistent user preferences
- **Font size persistence** across all content using localStorage
- **Smooth scrolling navigation** to specific content sections
- **Slide mode** for presentation-style viewing
- **Audio player integration** for multiple audio formats
- **PDF generation** for individual songs and full books
- **Dark/Light theme** toggle with persistent preference

#### Performance Optimizations
- **Code splitting** for vendor libraries (Vue, Firebase, PDF-lib, FontAwesome)
- **Lazy loading** for view components
- **Service Worker caching** for offline functionality
- **Intelligent API calls** with cache busting
- **Bundle optimization** with manual chunk management

### Technical Highlights

#### State Management
- **songStore**: Manages song data, fetching, and caching
- **poemStore**: Handles poem collections and author data
- **settingsStore**: User preferences (translation visibility, layout)
- **themeStore**: Dark/light mode management
- **navigationStore**: Mobile navigation state

#### Utility Functions
- **hyperlinkParser**: Custom link parsing and navigation
- **songProcessor**: Content rendering with translation layouts
- **poemFetcher**: Dynamic poem discovery via GitHub API
- **pdfBookUtils**: PDF generation and book management
- **audioUtils**: Audio link detection and processing
- **fontUtils**: Font size management with persistence

#### Component Architecture
- **SongDisplay**: Main content viewer with 645 active lines
- **SongList**: Content listing with 695 active lines
- **NavigationBar**: Mobile-responsive navigation with 647 active lines
- **AudioPlayer**: Multi-format audio playback with 567 active lines
- **TranslationControls**: Reusable translation UI components
- **ShareControls**: Social sharing and link copying

## Global Reach & User Base

The app serves users across multiple continents:
- **Australia, Canada, France, Germany, Mauritius, South Africa, UK, US**
- Multi-language support with mainly Turkish and English contents
- Responsive design for mobile, tablet, and desktop devices
- Offline functionality for areas with limited connectivity

## Content Structure

### Data Files
- `ilahi.txt` - Main song collection (162 ilahis as of Aug 10, 2025; target is at least 366)
- `naat.txt` - Urdu poetry (96 poems as of Aug 10, 2025, expecting at least 100 more)
- `poem-*.txt` - Multi-author poetry files
- Dynamic content discovery via GitHub API

### File Format
```
Y: (Song marker)
Category:
L: (Links)
A: (Alternative tunes)
Title
Lyrics content...
T: (Translation marker)
Translation content...
History: (Historical context)
Historical information...
```

## Future Improvements

### Technical Enhancements
1. **Advanced Search** - Full-text search with filters
2. **User Accounts** - Personalized content and preferences
3. **Content Recommendations** - AI-powered suggestions
4. **Multi-language Support** - Additional language interfaces
5. **Advanced Audio Features** - Playlists and audio bookmarks
6. **Social Features** - Comments, ratings, and sharing
7. **Analytics Dashboard** - Usage statistics and insights

### Content Expansion
1. **More Poetry Collections** - Additional authors and styles
2. **Audio Content** - More audio recordings and variations
3. **Video Integration** - Video content and lectures
4. **Interactive Features** - Quizzes and learning tools
5. **Community Content** - User-submitted content moderation

### Performance & UX
1. **Progressive Loading** - Infinite scroll and virtual scrolling
2. **Advanced Caching** - Intelligent cache invalidation
3. **Accessibility** - WCAG compliance and screen reader support
4. **Mobile Optimization** - Native app-like experience
5. **Offline Sync** - Background content synchronization

## Development Statistics

- **Total Active Lines**: ~8,500-9,000 lines of code
- **Components**: 25+ Vue components
- **Utility Functions**: 30+ utility files
- **State Stores**: 5 Pinia stores
- **Views**: 11 main application views
- **Development Time**: 1+ year of continuous development
- **User Feedback**: Iterative improvements based on global user input

## Technology Stack Summary

- **Frontend**: Vue 3, TypeScript, Pinia, Vue Router
- **Styling**: Tailwind CSS, DaisyUI, FontAwesome
- **Build**: Vite, Rollup, PWA
- **Backend**: GitHub API, Firebase
- **Content**: Markdown-like parsing, PDF generation
- **Performance**: Service Workers, Code splitting, Lazy loading

This application represents a modern approach to serving historic content, combining traditional Ottoman literature with contemporary web technologies to create an accessible, performant, and user-friendly platform for global audiences.

---

*The app is actively maintained and continuously improved based on user feedback from around the world.*

# NUMBER OF LINES OF CODE

This is an approximate active lines count (excluding comments and empty lines) for the largest files as of August 10, 2025 
(after almost one year of creating this app and upgrading it based on feedback from users around the world: 
Australia, Canada, France, Germany, Mauritius South Africa, UK, US, ...)

Total estimated active lines: ~8,500-9,000 lines

SongList.vue: 695
NavigationBar.vue: 647
SongDisplay.vue: 645
QadiriWird.vue: 603
RifaiWird.vue: 600
AudioPlayer.vue: 567
songProcessor.ts: 472
pdfBookUtils.ts: 378
YouTubePlayer.vue: 377
CategorySelector.vue: 260
songStore.ts: 244
categoryUtils.ts: 228
BookView.vue: 214
singleSongPDF.ts: 182
pronunciationService.ts: 177
hyperlinkParser.ts: 172
PronunciationGuide.vue: 175
fullSongBookPDF.ts: 116
poemFetcher.ts: 113
Entrance.vue: 163
BooksView.vue: 166
App.vue: 161
Home.vue: 89
Poems.vue: 99
AuthorPoems.vue: 95
Wirds.vue: 61
themeStore.ts: 51
cleanupMissingBooks.ts: 54
quoteFetcher.ts: 55
zoom.ts: 68
contentConfig.ts: 84
ShareControls.vue: 39
TranslationControls.vue: 36
SearchBar.vue: 36
settingsStore.ts: 35
poemProcessor.ts: 42
fontUtils.ts: 27
audioUtils.ts: 24
linkUtils.ts: 21
types.ts: 32
search.ts: 32
zikrUtils.ts: 32
main.ts: 78
firebase.ts: 42
version.mts: 15
slideUtils.ts: 15
playerUtils.ts: 14
removeBookDuplicates.ts: 29
uploadBookMetadata.ts: 41
pdfWorker.ts: 12
translator.ts: 23
qrCodeGenerator.ts: 11
fontConfig.ts: 11
navigationStore.ts: 12
AboutView.vue: 27
HistoryView.vue: 34
MiscellaneousView.vue: 12
ThemeToggle.vue: 31
RandomIlahi.vue: 106
IlahiClasses.vue: 79
Quotes.vue: 57
Installation.vue: 129
ZikrPlayer.vue: 224
MenuItems.vue: 47
LanguageSelection.vue: 43
SelectedSongsManager.vue: 69
Settings.vue: 12
VersionDisplay.vue: 15
Poem.vue: 54





