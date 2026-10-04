import { lazy } from 'react';
import type { ComponentType } from 'react';

export interface ToolDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  categoryKey: string;
  route: string;
  component: ComponentType;
}

const FirstOrderLab = lazy(() => import('@/features/labs/FirstOrderLab'));
const SecondOrderLab = lazy(() => import('@/features/labs/SecondOrderLab'));
const PidLab = lazy(() => import('@/features/labs/PidLab'));
const DCMotorLab = lazy(() => import('@/features/labs/DCMotorLab'));
const BodeLab = lazy(() => import('@/features/labs/BodeLab'));
const PoleZeroLab = lazy(() => import('@/features/labs/PoleZeroLab'));
const NyquistLab = lazy(() => import('@/features/labs/NyquistLab'));
const RootLocusLab = lazy(() => import('@/features/labs/RootLocusLab'));

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: 'first-order',
    titleKey: 'tools.firstOrder.title',
    descKey: 'tools.firstOrder.desc',
    categoryKey: 'category.timeDomain',
    route: '/labs/first-order',
    component: FirstOrderLab
  },
  {
    id: 'second-order',
    titleKey: 'tools.secondOrder.title',
    descKey: 'tools.secondOrder.desc',
    categoryKey: 'category.timeDomain',
    route: '/labs/second-order',
    component: SecondOrderLab
  },
  {
    id: 'bode',
    titleKey: 'tools.bode.title',
    descKey: 'tools.bode.desc',
    categoryKey: 'category.frequencyDomain',
    route: '/labs/bode',
    component: BodeLab
  },
  {
    id: 'pole-zero',
    titleKey: 'tools.poleZero.title',
    descKey: 'tools.poleZero.desc',
    categoryKey: 'category.frequencyDomain',
    route: '/labs/pole-zero',
    component: PoleZeroLab
  },
  {
    id: 'nyquist',
    titleKey: 'tools.nyquist.title',
    descKey: 'tools.nyquist.desc',
    categoryKey: 'category.frequencyDomain',
    route: '/labs/nyquist',
    component: NyquistLab
  },
  {
    id: 'root-locus',
    titleKey: 'tools.rootLocus.title',
    descKey: 'tools.rootLocus.desc',
    categoryKey: 'category.frequencyDomain',
    route: '/labs/root-locus',
    component: RootLocusLab
  },
  {
    id: 'pid',
    titleKey: 'tools.pid.title',
    descKey: 'tools.pid.desc',
    categoryKey: 'category.controllers',
    route: '/labs/pid',
    component: PidLab
  },
  {
    id: 'dc-motor',
    titleKey: 'tools.dcMotor.title',
    descKey: 'tools.dcMotor.desc',
    categoryKey: 'category.systems',
    route: '/labs/dc-motor',
    component: DCMotorLab
  }
];
