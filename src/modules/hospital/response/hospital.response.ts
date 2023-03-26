export interface IHospitalResponse {
  id: string;
  name: string;
  location: {
    detailedName: string;
    coordinates: {
      lat: string;
      lng: string;
    };
  };
}
