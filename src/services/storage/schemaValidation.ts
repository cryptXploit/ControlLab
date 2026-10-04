import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  labType: z.enum(['FIRST_ORDER', 'SECOND_ORDER', 'PID', 'DC_MOTOR', 'NYQUIST', 'ROOT_LOCUS', 'MARGIN', 'DISTURBANCE', 'ROUTH', 'ANTI_WINDUP']),
  parameters: z.record(z.string(), z.number()),
  notes: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const HistorySchema = z.object({
  id: z.string(),
  projectId: z.string().optional(),
  labType: z.string(),
  parameterSnapshot: z.record(z.string(), z.number()),
  resultSummary: z.record(z.string(), z.number()),
  timestamp: z.number(),
});

export const BackupSchema = z.object({
  app: z.literal('ControlLab'),
  backupVersion: z.literal(1),
  createdAt: z.number(),
  projects: z.array(ProjectSchema),
  history: z.array(HistorySchema),
});

export type BackupData = z.infer<typeof BackupSchema>;
