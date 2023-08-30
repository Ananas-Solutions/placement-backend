import { IHospitalResponse } from 'hospital/response';

export interface ISingleAuthorityResponse {
  id: string;
  name: string;
  initials: string;
  contactEmail: string;
  hospitals?: IHospitalResponse[];
}
