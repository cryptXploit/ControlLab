export type SearchItemType = 'LAB' | 'TOOL' | 'CONCEPT';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  aliases: string[];
  tags: string[];
}

export const staticSearchContent: SearchItem[] = [
  {
    id: 'lab-pid-1',
    type: 'LAB',
    title: 'PID Controller',
    description: 'Learn to tune Proportional, Integral, and Derivative gains.',
    aliases: ['proportional integral derivative', 'tuning', 'pid', 'controller'],
    tags: ['control', 'feedback', 'closed loop']
  },
  {
    id: 'lab-first-order-1',
    type: 'LAB',
    title: 'First-Order System',
    description: 'Analyze step responses and time constants of basic systems.',
    aliases: ['rc circuit', 'time constant', 'first order', 'step response'],
    tags: ['transient', 'open loop', 'dynamics']
  },
  {
    id: 'concept-kp-1',
    type: 'CONCEPT',
    title: 'Proportional Gain (Kp)',
    description: 'The gain applied to the present error to generate a control action.',
    aliases: ['kp', 'gain', 'multiplier', 'proportional'],
    tags: ['math', 'theory', 'pid parameter']
  }
];
