import { TrainingDaysEnum } from 'src/training-time-slot/types/training-site-days.enum';

export interface StudentTrainingSites {
  name: string;
  authority: any;
  hospital: any;
  department: any;
  startTime: string;
  endTime: string;
  day: string[];
}
