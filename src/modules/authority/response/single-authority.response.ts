import { IHospitalResponse } from 'hospital/response';

export interface ISingleAuthorityResponse {
  id: string;
  name: string;
  initials: string;
  hospitals?: IHospitalResponse[];
}
