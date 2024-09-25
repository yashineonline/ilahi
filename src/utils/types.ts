export interface SongData {
  title: string;
  lyrics: string[][];
  translation: string[][];
  audioLink?: string;
  categories: string[];
  tags: string[];
  isUnderEdit: boolean;
  slug: string;
}