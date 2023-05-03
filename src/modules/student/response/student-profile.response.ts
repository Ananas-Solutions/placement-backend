export interface IStudentProfileResponse {
  userId: string;
  name: string;
  email: string;
  studentId: string;
  alternateEmail: string;
  phone: string;
  alternatePhone: string;
  gender: string;
  dob: Date;
  address: {
    address1: string;
    address2: string;
    city: string;
    country: string;
    state: string;
    postalCode: string;
  };
  kin: object;
  imageUrl: string;
}
