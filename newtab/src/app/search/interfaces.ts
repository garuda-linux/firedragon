export interface SearchEngine {
  iconURL?: string | null;
  id: string;
  name: string;
}

export interface SearchSuggestionEntry {
  value: string;
}

export interface SearchSuggestions {
  local: SearchSuggestionEntry[];
  remote: SearchSuggestionEntry[];
}

declare global {
  interface FDSearchEngine {
    GetDefaultEngine(): Promise<SearchEngine>;
    EngineOffersSuggestions(engineId: string): Promise<boolean>;
    FetchSuggestions(
      engineId: string,
      searchTerm: string,
    ): Promise<SearchSuggestions>;
    PerformSearch(engineId: string, searchTerm: string): Promise<void>;
  }

  export const FDSearchEngine: FDSearchEngine;
}
