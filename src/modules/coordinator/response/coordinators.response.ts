export interface ICoordinatorResponse {
  id: string;
  name: string;
  email: string;
  department?: {
    id: string;
    name: string;
  };
}
