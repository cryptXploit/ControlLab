import Dexie, { type Table } from 'dexie';

export type LabType = 'FIRST_ORDER' | 'SECOND_ORDER' | 'PID' | 'DC_MOTOR' | 'NYQUIST' | 'ROOT_LOCUS' | 'MARGIN' | 'DISTURBANCE' | 'ROUTH' | 'ANTI_WINDUP' | 'TRANSFER_FUNCTION' | 'MASS_SPRING' | 'SIGNAL_RESPONSE' | 'LEAD_LAG' | 'ZIEGLER_NICHOLS';

export interface Project {
  id: string;
  name: string;
  labType: LabType;
  parameters: Record<string, number | string>;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  fingerprint?: {
    typeKey?: string;
    metrics?: {
      labelKey: string;
      value: string | number;
      unit?: string;
    }[];
  };
}

export interface ExperimentHistory {
  id: string;
  projectId?: string;
  labType: string;
  parameterSnapshot: Record<string, number>;
  resultSummary: Record<string, number>;
  timestamp: number;
}

export class ControlLabDB extends Dexie {
  projects!: Table<Project, string>;
  history!: Table<ExperimentHistory, string>;

  constructor() {
    super('ControlLabDB');
    this.version(1).stores({
      projects: 'id, labType, createdAt',
      history: 'id, projectId, labType, timestamp'
    });
  }
}

export const db = new ControlLabDB();
