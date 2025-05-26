import { AuthorityResponse } from 'authority/response';
import { DepartmentResponse } from 'department/response';
import { HospitalResponse } from 'hospital/response';

export interface IDepartmentUnitDetailResponse {
  id: string;
  name: string;
  contactEmail: string;
  department: DepartmentResponse;
  hospital: HospitalResponse;
  authority: AuthorityResponse;
}
