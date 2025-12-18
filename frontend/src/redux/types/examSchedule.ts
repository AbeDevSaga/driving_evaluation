import { Exam } from "./exam";

export interface ExamSchedule {
  schedule_id: string;
  exam_id: string;
  is_active: boolean;
  exam_date: string; // ISO string
  location?: string | null;
  created_at?: string;
  updated_at?: string;
  exam?: Exam;
}

// Payload to create a new schedule
export interface CreateExamSchedulePayload {
  exam_id: string;
  exam_date: string;
  location?: string;
}

// Payload to update a schedule
export interface UpdateExamSchedulePayload {
  exam_date?: string;
  location?: string;
}
