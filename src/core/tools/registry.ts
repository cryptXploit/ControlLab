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
const MarginLab = lazy(() => import('@/features/labs/MarginLab'));
const CompareLab = lazy(() => import('@/features/labs/CompareLab'));
const SweepLab = lazy(() => import('@/features/labs/SweepLab'));
const DisturbanceLab = lazy(() => import('@/features/labs/DisturbanceLab'));
const RouthLab = lazy(() => import('@/features/labs/RouthLab'));
const AntiWindupLab = lazy(() => import('@/features/labs/AntiWindupLab'));

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
    id: 'margin',
    titleKey: 'tools.margin.title',
    descKey: 'tools.margin.desc',
    categoryKey: 'category.frequencyDomain',
    route: '/labs/margin',
    component: MarginLab
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
  },
  {
    id: 'compare',
    titleKey: 'tools.compare.title',
    descKey: 'tools.compare.desc',
    categoryKey: 'category.analysis',
    route: '/labs/compare',
    component: CompareLab
  },
  {
    id: 'sweep',
    titleKey: 'tools.sweep.title',
    descKey: 'tools.sweep.desc',
    categoryKey: 'category.analysis',
    route: '/labs/sweep',
    component: SweepLab
  },
  {
    id: 'disturbance',
    titleKey: 'tools.disturbance.title',
    descKey: 'tools.disturbance.desc',
    categoryKey: 'category.timeDomain',
    route: '/labs/disturbance',
    component: DisturbanceLab
  },
  {
    id: 'routh',
    titleKey: 'tools.routh.title',
    descKey: 'tools.routh.desc',
    categoryKey: 'category.analysis',
    route: '/labs/routh',
    component: RouthLab
  },
  {
    id: 'antiWindup',
    titleKey: 'tools.antiWindup.title',
    descKey: 'tools.antiWindup.desc',
    categoryKey: 'category.controllers',
    route: '/labs/anti-windup',
    component: AntiWindupLab
  }
];
