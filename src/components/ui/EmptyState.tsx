export function EmptyState({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4 border border-border-subtle">
        <Icon className="w-8 h-8 text-text-muted"/>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs">{description}</p>
    </div>
  );
}
