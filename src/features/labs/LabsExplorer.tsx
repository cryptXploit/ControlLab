import { useState } from 'react';
import { useLocation } from 'wouter';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import type { ToolDefinition } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Play } from 'lucide-react';

export function LabsExplorer() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [previewTool, setPreviewTool] = useState<ToolDefinition | null>(null);

  const groupedTools = TOOL_REGISTRY.reduce((acc, tool) => {
    if (!acc[tool.categoryKey]) {
      acc[tool.categoryKey] = [];
    }
    acc[tool.categoryKey].push(tool);
    return acc;
  }, {} as Record<string, ToolDefinition[]>);

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-text-primary mb-8">{(t as any)('nav.labs')}</h1>
      
      <div className="flex flex-col gap-10">
        {Object.entries(groupedTools).map(([categoryKey, tools]) => (
          <section key={categoryKey} className="w-full">
            <h2 className="text-lg font-semibold text-text-primary mb-4 uppercase tracking-wider text-sm border-b border-border-subtle pb-2">
              {(t as any)(categoryKey)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div 
                  key={tool.id} 
                  onClick={() => setPreviewTool(tool)}
                  className="block group h-full cursor-pointer"
                >
                  <Card interactive className="p-5 h-full flex flex-col bg-background-surface border border-border-subtle hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary transition-all duration-200">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      {(t as any)(tool.titleKey)}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 flex-1 leading-relaxed">
                      {(t as any)(tool.descKey)}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Tool Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background-base/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setPreviewTool(null)} 
          />
          <div className="relative w-full max-w-md bg-background-elevated rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border-subtle">
            <div className="flex justify-between items-center p-4 border-b border-border-subtle bg-background-surface">
              <h2 className="text-lg font-bold text-text-primary">{(t as any)(previewTool.titleKey)}</h2>
              <button 
                onClick={() => setPreviewTool(null)}
                className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-background-base rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-2">Purpose</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{(t as any)(previewTool.descKey)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background-base rounded-lg p-3 border border-border-subtle">
                  <h4 className="text-xs font-semibold text-text-muted uppercase mb-1">Inputs</h4>
                  <p className="text-sm text-text-primary">System parameters, references</p>
                </div>
                <div className="bg-background-base rounded-lg p-3 border border-border-subtle">
                  <h4 className="text-xs font-semibold text-text-muted uppercase mb-1">Outputs</h4>
                  <p className="text-sm text-text-primary">Time response, metrics</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setLocation(previewTool.route)} 
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold"
              >
                <Play className="w-4 h-4" /> Start Simulation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
