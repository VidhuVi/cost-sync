import { Attendee, MeetingContext, RecommendationResult, RecommendationStatus } from './models';

export function calculateTotalCost(attendees: Attendee[], durationInMinutes: number): number {
  if (!attendees || attendees.length === 0 || durationInMinutes <= 0) {
    return 0;
  }
  
  const totalHourlyRate = attendees.reduce((sum, attendee) => sum + attendee.hourlyRate, 0);
  return totalHourlyRate * (durationInMinutes / 60);
}

export function evaluateMeetingROI(cost: number, meetingContext: MeetingContext, attendeesCount: number): RecommendationResult {
  const { durationInMinutes, agenda } = meetingContext;
  
  // Rule 0: Incomplete
  if (attendeesCount === 0 || durationInMinutes <= 0) {
    return {
      status: RecommendationStatus.INCOMPLETE,
      message: "Add attendees to evaluate."
    };
  }

  const trimmedAgenda = agenda ? agenda.trim() : "";

  // Rule 1: No Agenda
  if (trimmedAgenda.length === 0) {
    return {
      status: RecommendationStatus.REJECT,
      message: "Meetings without an agenda are black holes. Write an agenda or cancel."
    };
  }

  // Rule 2: Vague Agenda
  if (trimmedAgenda.length < 10) {
    return {
      status: RecommendationStatus.WARN,
      message: "Agenda is too vague to justify the cost. Be specific."
    };
  }

  // Rule 3: Expensive Status Update
  const actionVerbs = ['decide', 'resolve', 'approve', 'finalize', 'vote', 'plan'];
  const lowerAgenda = trimmedAgenda.toLowerCase();
  const hasActionVerb = actionVerbs.some(verb => lowerAgenda.includes(verb));
  
  if (cost > 5000 && !hasActionVerb) {
    return {
      status: RecommendationStatus.REJECT,
      message: "Expensive meeting for a status update. Use async communication instead."
    };
  }

  // Rule 4: High Cost Threshold
  if (cost > 10000) {
    return {
      status: RecommendationStatus.WARN,
      message: "Highly expensive meeting. Ensure every attendee is strictly necessary."
    };
  }

  // Rule 5: Pass
  return {
    status: RecommendationStatus.APPROVE,
    message: "Clear agenda and actionable. Approved."
  };
}
