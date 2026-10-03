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
    <div className="flex flex-col md:flex-row flex-1 w-full max-w-screen-2xl mx-auto bg-background-base min-h-0">
      
      {/* MOBILE STICKY TOP / DESKTOP RIGHT */}
      <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2 border-b md:border-b-0 md:border-l border-border-subtle bg-background-base z-10 sticky top-0 md:h-full md:overflow-y-auto min-h-[30vh] max-h-[40vh] md:max-h-none shrink-0 md:shrink">
        <div className="px-4 py-3 flex justify-between items-center border-b border-border-subtle bg-background-surface">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          {actions}
        </div>
        <div className="flex-1 p-4 bg-background-surface min-h-[200px] flex flex-col">
          {graph}
        </div>
        {/* Desktop-only metrics/explanation - hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-col p-4 space-y-6 bg-background-base border-t border-border-subtle">
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

      {/* MOBILE SCROLL BOTTOM / DESKTOP LEFT */}
      <div className="flex-1 md:flex-none md:w-1/3 flex flex-col order-2 md:order-1 overflow-y-auto pb-24 md:pb-6 min-h-0 bg-background-base">
        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">{(t as any)('workspace.parameters')}</h3>
            <div className="space-y-1">
              {controls}
            </div>
          </section>
          
          {/* Mobile-only metrics/explanation - visible on mobile, hidden on md+ */}
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
