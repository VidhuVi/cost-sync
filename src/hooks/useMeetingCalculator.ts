import { useState, useEffect } from 'react';
import { Attendee, MeetingContext, RecommendationResult, RecommendationStatus } from '@/lib/models';
import { calculateTotalCost, evaluateMeetingROI } from '@/lib/logic';

export function useMeetingCalculator() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [meetingContext, setMeetingContext] = useState<MeetingContext>({
    durationInMinutes: 60,
    agenda: ''
  });
  
  const [totalCost, setTotalCost] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<RecommendationResult>({
    status: RecommendationStatus.INCOMPLETE,
    message: "Add attendees to evaluate."
  });

  // Calculate whenever state changes
  useEffect(() => {
    const cost = calculateTotalCost(attendees, meetingContext.durationInMinutes);
    const rec = evaluateMeetingROI(cost, meetingContext, attendees.length);
    
    setTotalCost(cost);
    setRecommendation(rec);
  }, [attendees, meetingContext]);

  const addAttendee = (role: string, rate: number) => {
    const newAttendee: Attendee = {
      id: crypto.randomUUID(),
      name: role,
      hourlyRate: rate
    };
    setAttendees([...attendees, newAttendee]);
  };

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id));
  };

  const updateDuration = (durationInMinutes: number) => {
    setMeetingContext({ ...meetingContext, durationInMinutes });
  };

  const updateAgenda = (agenda: string) => {
    setMeetingContext({ ...meetingContext, agenda });
  };
  
  const clearSession = () => {
    setAttendees([]);
    setMeetingContext({
      durationInMinutes: 60,
      agenda: ''
    });
  }

  return {
    attendees,
    meetingContext,
    totalCost,
    recommendation,
    addAttendee,
    removeAttendee,
    updateDuration,
    updateAgenda,
    clearSession
  };
}
