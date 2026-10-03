import { Link } from 'wouter';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { useTranslation } from '@/store/useLocaleStore';
import { Card } from '@/components/ui/Card';

export function LabsExplorer() {
  const { t } = useTranslation();

  return (
    <div className="p-4 max-w-screen-md mx-auto pb-24">
      <h1 className="text-2xl font-bold text-text-primary mb-6">{t('nav.labs')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOL_REGISTRY.map((tool) => (
          <Link href={`/labs/${tool.id}`} key={tool.id} className="block group">
            <Card className="p-4 h-full transition-colors hover:border-accent-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                {(t as any)(tool.titleKey)}
              </h3>
              <p className="text-sm text-text-secondary mt-1">{(t as any)(tool.descKey)}</p>
              <div className="mt-3 inline-flex items-center text-xs font-medium text-text-muted bg-bg-base px-2 py-1 rounded-md">
                {(t as any)(tool.categoryKey)}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
