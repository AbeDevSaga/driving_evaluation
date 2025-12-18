import { ExamSchedule } from "./examSchedule";
import { ExamSection } from "./examSection";
import { User } from "./user";

export interface ExaminerAssignment {
  assignment_id: string;
  examiner_id: string;
  section_id: string;
  exam_schedule_id: string;
  created_at?: string;
  updated_at?: string;
  
  examiner?: User;
  schedule?: ExamSchedule;
  section?: ExamSection;
}

export interface CreateExaminerAssignmentPayload {
  examiner_id: string;
  section_id: string;
  exam_schedule_id: string;
}

export interface UpdateExaminerAssignmentPayload {
  examiner_id?: string;
  section_id?: string;
  exam_schedule_id?: string;
}
