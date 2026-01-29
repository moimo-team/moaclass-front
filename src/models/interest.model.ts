export interface Interest {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface UserInterest {
  id: number;
  userId: number;
  interestId: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MeetingInterest {
  id: number;
  meetingId: number;
  interestId: number;
  createdAt: Date;
  updatedAt?: Date;
}
