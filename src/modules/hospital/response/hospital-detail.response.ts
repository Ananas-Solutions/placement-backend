import { IAuthorityResponse } from 'authority/response';
import { IDepartmentResponse } from 'department/response';
import { IHospitalResponse } from './hospital.response';

export interface IHospitalDetailResponse extends IHospitalResponse {
  authority: IAuthorityResponse;
  departments: IDepartmentResponse[];
}
