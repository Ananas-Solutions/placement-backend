import { ICollegeDepartmentResponse } from 'src/modules/college-department/response';
import { ISemesterResponse } from 'src/modules/semester/response';
import { IUserResponse } from 'user/response';

export interface ICourseDetailResponse {
  id: string;
  name: string;
  blockType?: string;
  coordinator?: IUserResponse;
  department: ICollegeDepartmentResponse;
  semester: ISemesterResponse;
}
