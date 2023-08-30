import { IAuthorityResponse } from 'authority/response';
import { IDepartmentResponse } from 'department/response';
import { IHospitalResponse } from 'hospital/response';

export interface IDepartmentUnitDetailResponse {
  id: string;
  name: string;
  contactEmail: string;
  department: IDepartmentResponse;
  hospital: IHospitalResponse;
  authority: IAuthorityResponse;
}
