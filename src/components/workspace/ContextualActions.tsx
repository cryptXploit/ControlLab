import { useTranslation } from '@/store/useLocaleStore';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { useLocation } from 'wouter';
import { HapticService } from '@/services/haptics/HapticService';
import { ArrowRight } from 'lucide-react';

export function ContextualActions() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();

  // Determine current toolId based on route
  const currentTool = TOOL_REGISTRY.find(t => t.route === location.split('?')[0]);
  
  if (!currentTool || !currentTool.relatedTools || currentTool.relatedTools.length === 0) {
    return null;
  }

  const handleNavigate = (route: string) => {
    HapticService.triggerSelection();
    setLocation(route);
  };

  return (
    <div className="mt-6 pt-6 border-t border-border-subtle shrink-0 pb-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
        {(t as any)('workspace.nextActions') || 'Explore Related'}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {currentTool.relatedTools.map(id => {
          const tool = TOOL_REGISTRY.find(t => t.id === id);
          if (!tool) return null;
          return (
            <button
              key={id}
              onClick={() => handleNavigate(tool.route)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-background-surface border border-border-subtle text-text-primary hover:border-accent-primary hover:bg-background-elevated transition-colors shadow-sm"
            >
              {(t as any)(tool.titleKey)}
              <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
