'use server'

import { getMeetingHistory, saveMeetingRecord } from "@/lib/db"
import { Attendee, MeetingContext, MeetingRecord, RecommendationResult } from "@/lib/models"
import { revalidatePath } from "next/cache"

export async function saveMeetingAction(
  meetingContext: MeetingContext,
  attendees: Attendee[],
  totalCost: number,
  recommendationResult: RecommendationResult
) {
  try {
    const meetingId = saveMeetingRecord(meetingContext, attendees, totalCost, recommendationResult)
    revalidatePath('/history')
    return { success: true, meetingId }
  } catch (error) {
    console.error('Failed to save meeting:', error)
    return { success: false, error: 'Failed to save meeting.' }
  }
}

export async function getHistoryAction(limit: number = 20, offset: number = 0): Promise<MeetingRecord[]> {
  try {
    return getMeetingHistory(limit, offset)
  } catch (error) {
    console.error('Failed to fetch history:', error)
    return []
  }
}
