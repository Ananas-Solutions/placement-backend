import { AuthorityResponse } from 'authority/response';
import { IDepartmentResponse } from 'department/response';
import { IHospitalResponse } from './hospital.response';

export interface IHospitalDetailResponse extends IHospitalResponse {
  authority: AuthorityResponse;
  departments: IDepartmentResponse[];
}
