import { HospitalResponse } from 'hospital/response';
import { DepartmentResponse } from './department.response';

export interface IDepartmentDetailResponse extends DepartmentResponse {
  hospital: HospitalResponse;
}
