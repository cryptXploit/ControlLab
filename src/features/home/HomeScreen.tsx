import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { SearchOmnibox } from '@/features/search/SearchOmnibox';
import { useProjectStore } from '@/store/useProjectStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useTranslation } from '@/store/useLocaleStore';
import { CHALLENGES, type Challenge } from '@/core/challenges/content';
import { Play } from 'lucide-react';
import type { Project } from '@/services/storage/db';

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { projects } = useProjectStore();
  const { setActiveChallenge } = useChallengeStore();
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

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    handleNavigateToLab(challenge.labType);
  };

  const handleLoadProject = (project: Project) => {
    handleNavigateToLab(project.labType);
  };

  const recentProjects = [...projects]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-10 w-full max-w-3xl mx-auto pb-24 px-4 overflow-x-hidden">
      
      {/* Header */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">{t(greetingKey)}</h1>
        <p className="text-text-secondary">{t('home.subtitle')}</p>
      </div>

      {/* Search */}
      <div className="w-full">
        <SearchOmnibox />
      </div>

      {/* Practice & Challenges */}
      <div className="w-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4 uppercase tracking-wider text-sm">{t('home.practice')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHALLENGES.map(challenge => (
            <button
              key={challenge.id}
              onClick={() => handleStartChallenge(challenge)}
              className="flex flex-col items-start text-left p-5 bg-background-elevated border border-border-subtle rounded-xl hover:border-accent-primary hover:shadow-md transition-all group"
            >
              <div className="flex justify-between w-full mb-2">
                <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{challenge.title}</h3>
                <span className="font-mono text-xs bg-background-base text-accent-primary px-2 py-1 rounded">
                  {challenge.labType}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {challenge.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Labs */}
      <div className="w-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4 uppercase tracking-wider text-sm">{t('home.quickLabs')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigateToLab('FIRST_ORDER')}
            className="flex flex-col items-center justify-center p-4 bg-background-elevated border border-border-subtle rounded-xl hover:border-accent-primary hover:shadow-md transition-all group"
          >
            <div className="font-mono text-accent-primary mb-2 text-2xl group-hover:scale-110 transition-transform">1°</div>
            <div className="text-sm font-medium text-text-primary text-center">First-Order</div>
          </button>
          
          <button 
            onClick={() => handleNavigateToLab('SECOND_ORDER')}
            className="flex flex-col items-center justify-center p-4 bg-background-elevated border border-border-subtle rounded-xl hover:border-accent-primary hover:shadow-md transition-all group"
          >
            <div className="font-mono text-accent-primary mb-2 text-2xl group-hover:scale-110 transition-transform">2°</div>
            <div className="text-sm font-medium text-text-primary text-center">Second-Order</div>
          </button>

          <button 
            onClick={() => handleNavigateToLab('PID')}
            className="flex flex-col items-center justify-center p-4 bg-background-elevated border border-border-subtle rounded-xl hover:border-accent-primary hover:shadow-md transition-all group"
          >
            <div className="font-mono text-accent-primary mb-2 text-2xl group-hover:scale-110 transition-transform">PID</div>
            <div className="text-sm font-medium text-text-primary text-center">Controller</div>
          </button>

          <button 
            onClick={() => handleNavigateToLab('DC_MOTOR')}
            className="flex flex-col items-center justify-center p-4 bg-background-elevated border border-border-subtle rounded-xl hover:border-accent-primary hover:shadow-md transition-all group"
          >
            <div className="font-mono text-accent-primary mb-2 text-2xl group-hover:scale-110 transition-transform">DC</div>
            <div className="text-sm font-medium text-text-primary text-center">Motor Pos</div>
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="w-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4 uppercase tracking-wider text-sm">{(t as any)('home.recent')}</h2>
        {recentProjects.length === 0 ? (
          <div className="text-center text-text-muted py-8 border border-dashed border-border-strong rounded-xl bg-background-surface">
            {(t as any)('home.noRecent')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentProjects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-background-elevated border border-border-subtle rounded-lg">
                <div className="text-left">
                  <h3 className="font-medium text-text-primary">{project.name}</h3>
                  <span className="font-mono text-xs text-text-muted">{project.labType}</span>
                </div>
                <button
                  onClick={() => handleLoadProject(project)}
                  className="p-2 bg-background-base text-accent-primary rounded hover:bg-accent-primary hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
