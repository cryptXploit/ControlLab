import { Search, FlaskConical, BookOpen, Wrench } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';

export default function SearchOmnibox() {
  const { query, results, setQuery } = useSearchStore();

  const hasResults = results.labs.length > 0 || results.concepts.length > 0 || results.tools.length > 0;

  return (
    <div className="w-full max-w-2xl relative mb-8 z-10">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-border-strong rounded-xl bg-background-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all shadow-sm"
          placeholder="Search for labs, concepts, or tools (e.g., 'prop', 'rc')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-elevated border border-border-subtle rounded-xl shadow-xl overflow-hidden max-h-96 overflow-y-auto">
          {!hasResults ? (
            <div className="p-6 text-center text-text-secondary">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.labs.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-semibold text-text-muted tracking-wider uppercase flex items-center gap-2">
                    <FlaskConical className="h-3 w-3" /> Labs
                  </div>
                  {results.labs.map(lab => (
                    <div key={lab.id} className="px-4 py-3 hover:bg-background-surface cursor-pointer transition-colors border-l-2 border-transparent hover:border-accent-primary">
                      <div className="font-medium text-text-primary">{lab.title}</div>
                      <div className="text-sm text-text-secondary mt-0.5">{lab.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {results.concepts.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-semibold text-text-muted tracking-wider uppercase flex items-center gap-2">
                    <BookOpen className="h-3 w-3" /> Concepts
                  </div>
                  {results.concepts.map(concept => (
                    <div key={concept.id} className="px-4 py-3 hover:bg-background-surface cursor-pointer transition-colors border-l-2 border-transparent hover:border-accent-primary">
                      <div className="font-medium text-text-primary">{concept.title}</div>
                      <div className="text-sm text-text-secondary mt-0.5">{concept.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {results.tools.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-semibold text-text-muted tracking-wider uppercase flex items-center gap-2">
                    <Wrench className="h-3 w-3" /> Tools
                  </div>
                  {results.tools.map(tool => (
                    <div key={tool.id} className="px-4 py-3 hover:bg-background-surface cursor-pointer transition-colors border-l-2 border-transparent hover:border-accent-primary">
                      <div className="font-medium text-text-primary">{tool.title}</div>
                      <div className="text-sm text-text-secondary mt-0.5">{tool.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
