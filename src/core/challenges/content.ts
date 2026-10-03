export interface ChallengeMetricTarget {
  max?: number;
  min?: number;
}

export interface Challenge {
  id: string;
  titleKey: string;
  descKey: string;
  labType: 'FIRST_ORDER' | 'SECOND_ORDER' | 'PID' | 'DC_MOTOR';
  targetMetrics: Record<string, ChallengeMetricTarget>;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    titleKey: 'challenge.smoothMotor.title',
    descKey: 'challenge.smoothMotor.desc',
    labType: 'DC_MOTOR',
    targetMetrics: {
      overshoot: { max: 2.0 }
    }
  },
  {
    id: 'c2',
    titleKey: 'challenge.aggressivePid.title',
    descKey: 'challenge.aggressivePid.desc',
    labType: 'PID',
    targetMetrics: {
      settlingTime: { max: 1.5 },
      steadyStateError: { max: 0.05 }
    }
  },
  {
    id: 'c3',
    titleKey: 'challenge.criticalDamping.title',
    descKey: 'challenge.criticalDamping.desc',
    labType: 'SECOND_ORDER',
    targetMetrics: {
      overshoot: { max: 0.01 },
      settlingTime: { max: 2.0 }
    }
  }
];
