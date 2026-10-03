import { create } from 'zustand';
import { performSearch, type SearchResults } from '@/core/search/searchEngine';

interface SearchState {
  query: string;
  results: SearchResults;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: { labs: [], concepts: [], tools: [] },
  setQuery: (query: string) => {
    const results = performSearch(query);
    set({ query, results });
  }
}));
