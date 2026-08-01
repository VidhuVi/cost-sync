import Database from 'better-sqlite3';
import { Attendee, MeetingContext, MeetingRecord, RecommendationResult, RecommendationStatus } from './models';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      agenda TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      total_cost REAL NOT NULL,
      recommendation_status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS attendees (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      name TEXT NOT NULL,
      hourly_rate REAL NOT NULL,
      FOREIGN KEY(meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    );
  `);
}

// Call on startup
initializeDatabase();

export function saveMeetingRecord(
  meetingContext: MeetingContext,
  attendees: Attendee[],
  totalCost: number,
  recommendationResult: RecommendationResult
): string {
  const meetingId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const insertMeeting = db.prepare(`
    INSERT INTO meetings (id, agenda, duration_minutes, total_cost, recommendation_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertAttendee = db.prepare(`
    INSERT INTO attendees (id, meeting_id, name, hourly_rate)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    insertMeeting.run(
      meetingId,
      meetingContext.agenda,
      meetingContext.durationInMinutes,
      totalCost,
      recommendationResult.status,
      createdAt
    );

    for (const attendee of attendees) {
      insertAttendee.run(crypto.randomUUID(), meetingId, attendee.name, attendee.hourlyRate);
    }
  });

  transaction();
  
  return meetingId;
}

export function getMeetingHistory(limit: number = 20, offset: number = 0): MeetingRecord[] {
  const meetingsStmt = db.prepare(`
    SELECT id, agenda, duration_minutes as durationInMinutes, total_cost as totalCost, recommendation_status as recommendationStatus, created_at as createdAt
    FROM meetings
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const attendeesStmt = db.prepare(`
    SELECT id, name, hourly_rate as hourlyRate
    FROM attendees
    WHERE meeting_id = ?
  `);

  const rows = meetingsStmt.all(limit, offset) as any[];

  return rows.map((row) => {
    const attendees = attendeesStmt.all(row.id) as Attendee[];
    return {
      id: row.id,
      agenda: row.agenda,
      durationInMinutes: row.durationInMinutes,
      totalCost: row.totalCost,
      recommendationStatus: row.recommendationStatus as RecommendationStatus,
      createdAt: row.createdAt,
      attendees,
    };
  });
}
