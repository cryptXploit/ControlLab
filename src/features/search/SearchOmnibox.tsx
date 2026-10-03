import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { HapticService } from '@/services/haptics/HapticService';

export function SearchOmnibox() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');

  // Dynamically index the translated strings so Bangla search works natively
  const fuse = useMemo(() => {
    const searchableTools = TOOL_REGISTRY.map(tool => ({
      id: tool.id,
      title: (t as any)(tool.titleKey),
      desc: (t as any)(tool.descKey),
      category: (t as any)(tool.categoryKey),
      route: tool.route,
    }));
    return new Fuse(searchableTools, {
      keys: ['title', 'desc', 'category'],
      threshold: 0.3,
    });
  }, [t]);

  const results = query ? fuse.search(query).slice(0, 5) : [];

  const handleSelect = (route: string) => {
    HapticService.triggerSelection();
    setQuery('');
    setLocation(route);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 z-40">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-text-muted"/>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={(t as any)('search.placeholder') || 'Search tools, labs...'}
          aria-label={(t as any)('search.placeholder') || 'Search tools, labs...'}
          className="w-full pl-10 pr-4 py-3 bg-background-elevated border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-text-primary placeholder:text-text-muted shadow-sm transition-all"
        />
      </div>

      {query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-elevated border border-border-subtle rounded-xl shadow-xl overflow-hidden p-4 text-center text-text-secondary text-sm">
          {(t as any)('search.noResults') || 'No results found'}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-elevated border border-border-subtle rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {results.map(({ item }) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.route)}
              className="w-full text-left px-4 py-3 border-b border-border-subtle hover:bg-background-base last:border-0 transition-colors focus:bg-background-base focus:outline-none"
            >
              <div className="text-sm font-semibold text-text-primary">{item.title}</div>
              <div className="text-xs text-text-secondary truncate mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
