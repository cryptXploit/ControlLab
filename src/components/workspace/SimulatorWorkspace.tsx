import React from 'react';
import { useTranslation } from '@/store/useLocaleStore';

interface SimulatorWorkspaceProps {
  title: string;
  graph: React.ReactNode;
  controls: React.ReactNode;
  metrics: React.ReactNode;
  explanation: React.ReactNode;
  actions: React.ReactNode;
}

export function SimulatorWorkspace({ title, graph, controls, metrics, explanation, actions }: SimulatorWorkspaceProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-background-base overflow-hidden">
      
      {/* MOBILE TOP / DESKTOP RIGHT (Graph Panel) */}
      <div className="w-full md:w-2/3 h-[45%] md:h-full flex flex-col order-1 md:order-2 border-b md:border-b-0 md:border-l border-border-subtle bg-background-surface shrink-0 relative z-10">
        <div className="px-4 py-3 flex justify-between items-center border-b border-border-subtle bg-background-surface shrink-0">
          <h2 className="text-base font-semibold text-text-primary truncate mr-2">{title}</h2>
          <div className="shrink-0">{actions}</div>
        </div>
        <div className="flex-1 p-2 sm:p-4 min-h-0 flex flex-col relative">
          {graph}
        </div>
        {/* Desktop-only metrics/explanation - fixed at bottom of right panel on desktop */}
        <div className="hidden md:flex flex-col p-4 space-y-4 bg-background-base border-t border-border-subtle shrink-0 max-h-[40%] overflow-y-auto">
          <section>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{(t as any)('workspace.metrics')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {metrics}
            </div>
          </section>
          <section>
            {explanation}
          </section>
        </div>
      </div>

      {/* MOBILE BOTTOM / DESKTOP LEFT (Controls Panel) */}
      <div className="flex-1 md:w-1/3 flex flex-col order-2 md:order-1 min-h-0 bg-background-base relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 md:pb-6">
          <section>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">{(t as any)('workspace.parameters')}</h3>
            <div className="space-y-1">
              {controls}
            </div>
          </section>
          
          {/* Mobile-only metrics/explanation - visible on mobile, hidden on desktop */}
          <div className="md:hidden space-y-6">
            <section>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">{(t as any)('workspace.metrics')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {metrics}
              </div>
            </section>
            <section>
              {explanation}
            </section>
          </div>
        </div>
      </div>

    </div>
  );
}
