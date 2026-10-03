export interface ChallengeMetricTarget {
  max?: number;
  min?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  labType: 'FIRST_ORDER' | 'SECOND_ORDER' | 'PID' | 'DC_MOTOR';
  targetMetrics: Record<string, ChallengeMetricTarget>;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Smooth the DC Motor',
    labType: 'DC_MOTOR',
    description: 'Tune Kd so the motor settles with less than 2% overshoot, avoiding violent mechanical jerks.',
    targetMetrics: {
      overshoot: { max: 2.0 }
    }
  },
  {
    id: 'c2',
    title: 'Aggressive PID Tracking',
    labType: 'PID',
    description: 'Achieve a settling time under 1.5s with a steady-state error below 0.05. Keep overshoot acceptable.',
    targetMetrics: {
      settlingTime: { max: 1.5 },
      steadyStateError: { max: 0.05 }
    }
  },
  {
    id: 'c3',
    title: 'Critically Damped Transition',
    labType: 'SECOND_ORDER',
    description: 'Adjust the damping ratio (ζ) to eliminate overshoot entirely without exceeding 2.0s settling time.',
    targetMetrics: {
      overshoot: { max: 0.01 },
      settlingTime: { max: 2.0 }
    }
  }
];
