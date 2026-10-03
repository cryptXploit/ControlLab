import { useLocation } from 'wouter';
import { useTranslation } from '@/store/useLocaleStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { CHALLENGES } from '@/core/challenges/content';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function PracticeScreen() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { completedIds, setActiveChallenge } = useChallengeStore();

  const handleStart = (challenge: any) => {
    setActiveChallenge(challenge);
    const mapping: Record<string, string> = {
      'FIRST_ORDER': 'first-order',
      'SECOND_ORDER': 'second-order',
      'PID': 'pid',
      'DC_MOTOR': 'dc-motor'
    };
    setLocation(`/labs/${mapping[challenge.labType] || challenge.labType}`);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-text-primary">
          {(t as any)('practice.title')}
        </h1>
        <p className="text-text-secondary mt-2">
          {(t as any)('nav.practice')} - {completedIds.length}/{CHALLENGES.length} {(t as any)('practice.completed')}
        </p>
      </header>

      <div className="space-y-4">
        {CHALLENGES.map(challenge => {
          const isCompleted = completedIds.includes(challenge.id);
          return (
            <Card key={challenge.id} className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isCompleted ? 'border-status-success/30 bg-status-success/5' : ''}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-status-success" /> : <div className="w-2 h-2 rounded-full bg-accent-primary" />}
                  <h3 className={`font-bold text-lg ${isCompleted ? 'text-status-success' : 'text-text-primary'}`}>
                    {(t as any)(challenge.titleKey)}
                  </h3>
                </div>
                <p className="text-text-secondary text-sm">{(t as any)(challenge.descKey)}</p>
              </div>
              <div className="shrink-0 flex items-center justify-end">
                {isCompleted ? (
                  <span className="text-status-success font-medium text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {(t as any)('practice.completed')}
                  </span>
                ) : (
                  <Button onClick={() => handleStart(challenge)}>
                    {(t as any)('practice.start')}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
