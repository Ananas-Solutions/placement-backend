import { ICollegeDepartmentResponse } from 'src/modules/college-department/response';

import { IUserResponse } from 'user/response';

export interface ICourseDetailResponse {
  id: string;
  name: string;
  creditHours: number;
  blockType?: string;
  coordinator?: IUserResponse;
  department: ICollegeDepartmentResponse;
  semester: any;
  allCoordinators?: IUserResponse[];
}
