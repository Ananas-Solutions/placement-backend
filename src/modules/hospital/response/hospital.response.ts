export interface IHospitalResponse {
  id: string;
  name: string;
  location: {
    detailedName: string;
    latLng: {
      lat: number;
      lng: number;
    };
  };
  contactEmail: string;
}
