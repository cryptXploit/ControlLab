import { Link } from 'wouter';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import type { ToolDefinition } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { Card } from '@/components/ui/Card';

export function LabsExplorer() {
  const { t } = useTranslation();

  // Group tools by categoryKey
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
                <Link href={tool.route} key={tool.id} className="block group h-full">
                  <Card interactive className="p-5 h-full flex flex-col bg-background-surface border border-border-subtle hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary transition-all duration-200">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      {(t as any)(tool.titleKey)}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 flex-1 leading-relaxed">
                      {(t as any)(tool.descKey)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
