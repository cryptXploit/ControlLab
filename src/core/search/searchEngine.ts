import Fuse from 'fuse.js';
import { staticSearchContent, type SearchItem } from './content';

const fuse = new Fuse(staticSearchContent, {
  keys: ['title', 'aliases', 'tags'],
  threshold: 0.3,
});

export interface SearchResults {
  labs: SearchItem[];
  concepts: SearchItem[];
  tools: SearchItem[];
}

export function performSearch(query: string): SearchResults {
  if (!query.trim()) {
    return { labs: [], concepts: [], tools: [] };
  }

  const results = fuse.search(query).map(result => result.item);

  return {
    labs: results.filter(item => item.type === 'LAB'),
    concepts: results.filter(item => item.type === 'CONCEPT'),
    tools: results.filter(item => item.type === 'TOOL')
  };
}
