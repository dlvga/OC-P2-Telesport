import { Participation } from './participation';

export interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}
