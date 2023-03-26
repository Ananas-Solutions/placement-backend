import { IHospitalResponse } from 'hospital/response';
import { IDepartmentResponse } from './department.response';

export interface IDepartmentDetailResponse extends IDepartmentResponse {
  hospital: IHospitalResponse;
}
