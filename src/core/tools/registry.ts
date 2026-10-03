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
