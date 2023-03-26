import { SemesterEnum } from 'commons/enums';

export interface ISemesterResponse {
  id: string;
  semester: SemesterEnum;
  startYear: string;
  endYear: string;
}
