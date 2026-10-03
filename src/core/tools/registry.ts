import FirstOrderLab from '@/features/labs/FirstOrderLab';
import SecondOrderLab from '@/features/labs/SecondOrderLab';
import PidLab from '@/features/labs/PidLab';
import DCMotorLab from '@/features/labs/DCMotorLab';

export interface ToolDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  categoryKey: string;
  component: React.ComponentType;
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: 'first-order',
    titleKey: 'tools.firstOrder.title',
    descKey: 'tools.firstOrder.desc',
    categoryKey: 'category.timeDomain',
    component: FirstOrderLab
  },
  {
    id: 'second-order',
    titleKey: 'tools.secondOrder.title',
    descKey: 'tools.secondOrder.desc',
    categoryKey: 'category.timeDomain',
    component: SecondOrderLab
  },
  {
    id: 'pid',
    titleKey: 'tools.pid.title',
    descKey: 'tools.pid.desc',
    categoryKey: 'category.controllers',
    component: PidLab
  },
  {
    id: 'dc-motor',
    titleKey: 'tools.dcMotor.title',
    descKey: 'tools.dcMotor.desc',
    categoryKey: 'category.systems',
    component: DCMotorLab
  }
];
