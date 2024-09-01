export interface SongData {
  title: string;
  lyrics: string[][];
  translation: string[][];
  audioLink?: string;
  categories: string[];
  isUnderEdit: boolean;
  slug: string;
}