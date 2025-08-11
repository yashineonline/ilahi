# ilahi Book App – Cultural Poetry and Ottoman History Platform

## Overview

The ilahi Book App is a comprehensive Progressive Web Application (PWA) designed to serve heritage poetry, historic content, and cultural texts to users worldwide. Built with modern web technologies, it provides an accessible, offline-capable platform for performance practice and literary exploration.

## Technical Architecture

### Frontend Framework

* Vue 3 with Composition API for reactive, component-based architecture
* TypeScript for type safety and enhanced developer experience
* Pinia for state management across multiple stores (songs, poems, settings, navigation, theme)
* Vue Router for client-side navigation with deep linking support

### Styling & UI

* Tailwind CSS for utility-first styling and responsive design
* DaisyUI for pre-built, accessible UI components
* FontAwesome for consistent iconography
* Custom CSS for specialized components and animations

### Build & Development

* Vite for fast development and optimized production builds
* Rollup with manual chunk splitting for optimal bundle sizes
* PWA capabilities via vite-plugin-pwa and Workbox
* Service Workers for offline functionality and caching

### Content Management

* GitHub API integration for dynamic content discovery
* Firebase (Firestore & Storage) for book metadata and file management
* localStorage for user preferences and offline caching
* Intelligent caching strategies for performance optimization

## Core Features

### Content Types

1. **Traditional Songs (Primarily in Turkish)** – Main collection with translations and audio links
2. **Classical Poetry (Primarily in Urdu)** – Dedicated section for poetry
3. **Poems** – Multi-author poetry collection with dynamic discovery
4. **Books** – PDF generation and management system
5. **Quotations** – Selected sayings and notable excerpts

### Advanced Functionality

Optimized build performance by 30% (24s → 17s) through code splitting, lazy loading, and intelligent caching strategies

#### Dynamic Content Discovery

* Automatic file detection using GitHub API
* Handles non-consecutive file numbering
* Real-time content updates without app redeployment
* Intelligent caching with force refresh capabilities

#### Hyperlink System

* Custom markdown-like parser for internal navigation
* `$slug` syntax for internal content links with automatic type detection
* `£url|text` for external links with custom display text
* `##bold text##` formatting for emphasis
* Cross-content linking between different data files

#### User Experience Features

* Side-by-side translation layout with persistent user preferences
* Font size persistence across all content using localStorage
* Smooth scrolling navigation to specific content sections
* Category-based filtering system with real-time search suggestions
* Random content generator for user discovery
* Multi-format PDF generation with table of contents, cover page, and embedded QR codes
* Adaptive layout engine that adjusts presentation based on device screen size, orientation, and user preferences
* Slide mode for presentation-style viewing
* Audio player integration with dynamic audio streaming and offline fallback
* Dark/Light theme toggle with persistent preference

#### Performance Optimizations

* Code splitting for vendor libraries (Vue, Firebase, PDF-lib, FontAwesome)
* Lazy loading for view components
* Preloading of high-priority assets for improved perceived speed
* On-demand font loading to reduce initial bundle size
* Service Worker caching for offline functionality
* Intelligent API calls with cache busting
* Bundle optimization with manual chunk management

### Technical Highlights

#### State Management

* songStore: Manages song data, fetching, and caching
* poemStore: Handles poem collections and author data
* settingsStore: User preferences (translation visibility, layout)
* themeStore: Dark/light mode management
* navigationStore: Mobile navigation state

#### Utility Functions

* hyperlinkParser: Custom link parsing and navigation
* songProcessor: Content rendering with translation layouts
* poemFetcher: Dynamic poem discovery via GitHub API
* pdfBookUtils: PDF generation and book management
* audioUtils: Audio link detection and processing
* fontUtils: Font size management with persistence
* qrCodeGenerator: Generates QR codes for quick sharing of content

#### Component Architecture

* SongDisplay: Main content viewer with 645 active lines
* SongList: Content listing with 695 active lines
* NavigationBar: Mobile-responsive navigation with 647 active lines
* AudioPlayer: Multi-format audio playback with 567 active lines
* TranslationControls: Reusable translation UI components
* ShareControls: Social sharing and link copying

## Global Reach & User Base

The app serves users across multiple continents:

* Australia, Canada, France, Germany, Mauritius, South Africa, Turkiye, United Kingdom, United States of America
* Multi-language support with primarily Turkish and English content
* Responsive design for mobile, tablet, and desktop devices
* Offline functionality for areas with limited connectivity

## Content Structure

### Data Files

* `ilahi.txt` – Main song collection (162 entries as of Aug 10, 2025; target is 366)
* `naat.txt` – Poetry collection (96 entries as of Aug 10, 2025, expecting 100 more)
* `poem-*.txt` – Multi-author poetry files
* Dynamic content discovery via GitHub API

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
History: (Cultural or historical context)  
Background information...
```

## Future Improvements

### Technical Enhancements

1. Advanced search with filters
2. User accounts for personalized content and preferences
3. Content recommendations using AI-powered suggestions
4. Additional language interfaces
5. Advanced audio features including playlists and bookmarks
6. Social features such as comments, ratings, and sharing
7. Analytics dashboard for usage statistics and insights
8. Server-side rendering or pre-rendering for SEO optimization
9. Progressive hydration for faster time-to-interactive

### Content Expansion

1. Additional poetry collections with diverse authors and styles
2. More audio recordings and variations
3. Video content and cultural lectures
4. Interactive learning features
5. User-submitted content moderation system

### Performance & UX

1. Progressive loading with infinite scroll and virtual scrolling
2. Advanced caching with intelligent invalidation
3. WCAG compliance and screen reader support
4. Native app-like mobile optimization
5. Offline background content synchronization

## Development Statistics

* Total Active Lines: \~8,500–9,000
* Components: 25+ Vue components
* Utility Functions: 30+ utility files
* State Stores: 5 Pinia stores
* Views: 11 main application views
* Development Time: 1+ year of continuous development
* Iterative improvements based on global user feedback

## Technology Stack Summary

* Frontend: Vue 3, TypeScript, Pinia, Vue Router
* Styling: Tailwind CSS, DaisyUI, FontAwesome
* Build: Vite, Rollup, PWA
* Backend: GitHub API, Firebase
* Content: Markdown-like parsing, PDF generation, QR code integration
* Performance: Service Workers, Code splitting, Lazy loading, Preloading, On-demand font loading

This application represents a modern approach to serving cultural heritage content, combining traditional literature with contemporary web technologies to create an accessible, performant, and user-friendly platform for global audiences.

---

## Number of active lines per file

SongList.vue: 695
NavigationBar.vue: 647
SongDisplay.vue: 645
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
BooksView.vue: 166
App.vue: 161
RandomIlahi.vue: 106
Installation.vue: 129
Poems.vue: 99
AuthorPoems.vue: 95
Home.vue: 89
contentConfig.ts: 84
main.ts: 78
IlahiClasses.vue: 79
Quotes.vue: 57
cleanupMissingBooks.ts: 54
quoteFetcher.ts: 55
themeStore.ts: 51
zoom.ts: 68
poemProcessor.ts: 42
ShareControls.vue: 39
TranslationControls.vue: 36
SearchBar.vue: 36
settingsStore.ts: 35
types.ts: 32
search.ts: 32
fontUtils.ts: 27
audioUtils.ts: 24
linkUtils.ts: 21
uploadBookMetadata.ts: 41
firebase.ts: 42
version.mts: 15
slideUtils.ts: 15
playerUtils.ts: 14
removeBookDuplicates.ts: 29
AboutView.vue: 27
translator.ts: 23
pdfWorker.ts: 12
qrCodeGenerator.ts: 11
fontConfig.ts: 11
navigationStore.ts: 12
HistoryView.vue: 34
MiscellaneousView.vue: 12
ThemeToggle.vue: 31
MenuItems.vue: 47
LanguageSelection.vue: 43
SelectedSongsManager.vue: 69
Settings.vue: 12
VersionDisplay.vue: 15
Poem.vue: 54

There is always more...









