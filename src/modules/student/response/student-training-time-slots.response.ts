export interface IStudentTrainingTimeSlotsResponse {
  placementId: string;
  hospital: {
    id: string;
    name: string;
    location: any;
  };
  department: string;
  departmentUnit: string;
  supervisor: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    name: string;
  };
  trainingSite: {
    id: string;
  };
  startTime: string;
  endTime: string;
  day: string[];
  placementDate: string;
}
