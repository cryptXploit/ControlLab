import React from 'react';

interface SimulatorWorkspaceProps {
  title: string;
  graph: React.ReactNode;
  controls: React.ReactNode;
  metrics: React.ReactNode;
  explanation: React.ReactNode;
  actions: React.ReactNode;
}

export function SimulatorWorkspace({ title, graph, controls, metrics, explanation, actions }: SimulatorWorkspaceProps) {
  return (
    <div className="flex flex-col md:flex-row h-full w-full max-w-screen-2xl mx-auto overflow-hidden bg-bg-base">
      
      {/* MOBILE STICKY TOP / DESKTOP RIGHT */}
      <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2 border-b md:border-b-0 md:border-l border-border-subtle bg-bg-surface z-10 sticky top-0 md:relative">
        <div className="px-4 py-3 flex justify-between items-center border-b border-border-subtle bg-bg-surface">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          {actions}
        </div>
        <div className="flex-1 min-h-[250px] max-h-[40vh] md:max-h-none p-4">
          {graph}
        </div>
      </div>

      {/* MOBILE SCROLL BOTTOM / DESKTOP LEFT */}
      <div className="w-full md:w-1/3 flex flex-col order-2 md:order-1 overflow-y-auto pb-24 md:pb-6">
        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Parameters</h3>
            <div className="space-y-1">
              {controls}
            </div>
          </section>
          
          <section>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Metrics</h3>
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
  );
}
