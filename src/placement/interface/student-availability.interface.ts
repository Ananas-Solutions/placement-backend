export interface StudentAvailabilityInterface {
  id: string;
  name: string;
  email: string;
  hasPlacementSameDay: boolean;
  assignedPlacements?: [
    {
      trainingSite: string;
      timeSlot: {
        startTime: string;
        endTime: string;
      };
    },
  ];
}
