export interface Preferences {
  useSystemOpencc: boolean;
}

export type SearchType = "words" | "quotes";

export interface SearchResult {
  id: string;
  type: SearchType;
  text: string;
  author?: string;
  work?: string;
}
