export interface Attendee {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface MeetingContext {
  durationInMinutes: number;
  agenda: string;
}

export enum RecommendationStatus {
  REJECT = 'REJECT',
  WARN = 'WARN',
  APPROVE = 'APPROVE',
  INCOMPLETE = 'INCOMPLETE'
}

export interface RecommendationResult {
  status: RecommendationStatus;
  message: string;
}

export interface MeetingRecord {
  id: string;
  createdAt: string; // ISO string
  durationInMinutes: number;
  agenda: string;
  totalCost: number;
  recommendationStatus: RecommendationStatus;
  attendees: Attendee[];
}
