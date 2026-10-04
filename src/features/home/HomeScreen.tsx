import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { SearchOmnibox } from '@/features/search/SearchOmnibox';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useTranslation } from '@/store/useLocaleStore';
import { CHALLENGES } from '@/core/challenges/content';
import { TOOL_REGISTRY } from '@/core/tools/registry';
import { Play, FlaskConical, Target, Clock, ArrowRight } from 'lucide-react';
import type { Project } from '@/services/storage/db';

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { projects } = useProjectStore();
  const { t } = useTranslation();
  const [greetingKey, setGreetingKey] = useState<'home.greeting.morning' | 'home.greeting.afternoon' | 'home.greeting.evening'>('home.greeting.morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey('home.greeting.morning');
    else if (hour < 18) setGreetingKey('home.greeting.afternoon');
    else setGreetingKey('home.greeting.evening');
  }, []);

  const handleNavigateToLab = (labType: string) => {
    const mapping: Record<string, string> = {
      'FIRST_ORDER': 'first-order',
      'SECOND_ORDER': 'second-order',
      'PID': 'pid',
      'DC_MOTOR': 'dc-motor'
    };
    setLocation(`/labs/${mapping[labType] || labType}`);
  };

  const handleLoadProject = (project: Project) => {
    handleNavigateToLab(project.labType);
  };

  const recentProjects = [...projects]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-full shrink-0">
      
      {/* Header */}
      <div className="mt-2 mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-2">
          {t(greetingKey)}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="w-full mb-10">
        <SearchOmnibox />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Quick Labs Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> {t('home.quickLabs')}
              </h2>
              <button onClick={() => setLocation('/labs')} className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOOL_REGISTRY.slice(0, 4).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setLocation(tool.route)}
                  className="group text-left p-5 flex flex-col bg-background-elevated border border-border-subtle rounded-2xl hover:border-accent-primary focus:border-accent-primary outline-none transition-all duration-200"
                >
                  <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                    {(t as any)(tool.titleKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">
                    {(t as any)(tool.descKey)}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Practice & Challenges */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" /> {(t as any)('nav.practice')}
            </h2>
            <button
              onClick={() => setLocation('/practice')}
              className="w-full group flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-background-elevated to-background-base border border-border-subtle rounded-2xl hover:border-accent-primary transition-all duration-200 outline-none"
            >
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                  {(t as any)('practice.progress')}
                </h3>
                <p className="text-sm text-text-secondary">
                  {useChallengeStore.getState().completedIds?.length || 0} / {CHALLENGES.length} {(t as any)('practice.completed')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary transition-colors shrink-0">
                <Play className="w-4 h-4 text-accent-primary group-hover:text-white translate-x-[1px]" />
              </div>
            </button>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> {(t as any)('home.recent')}
              </h2>
              {projects.length > 3 && (
                <button onClick={() => setLocation('/projects')} className="text-xs font-semibold text-accent-primary hover:underline">
                  See All
                </button>
              )}
            </div>
            
            {recentProjects.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="group flex items-center justify-between p-4 bg-background-elevated border border-border-subtle rounded-2xl cursor-pointer hover:border-accent-primary transition-all duration-200" 
                    onClick={() => handleLoadProject(project)}
                  >
                    <div className="text-left flex-1 min-w-0 pr-3">
                      <h3 className="text-sm font-bold text-text-primary truncate">{project.name}</h3>
                      <span className="font-mono text-[10px] text-text-muted px-1.5 py-0.5 bg-background-base rounded mt-1 inline-block">
                        {project.labType}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background-base flex items-center justify-center border border-border-subtle group-hover:border-accent-primary group-hover:bg-accent-primary/5 transition-colors shrink-0">
                      <Play className="w-3 h-3 text-text-muted group-hover:text-accent-primary translate-x-[1px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-background-elevated border border-border-subtle rounded-2xl">
                <p className="text-sm text-text-muted">{(t as any)('home.noRecent') || 'No recent projects.'}</p>
              </div>
            )}
          </section>
          
        </div>
      </div>
      
      {/* Explicit spacer to guarantee scroll clearance for bottom nav */}
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))] shrink-0 w-full" />
    </div>
  );
}
