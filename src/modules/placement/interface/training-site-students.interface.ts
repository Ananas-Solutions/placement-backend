export interface ITrainingSiteStudents {
  student: {
    id: string;
    studentId: string;
    name: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  day: string[];
}
