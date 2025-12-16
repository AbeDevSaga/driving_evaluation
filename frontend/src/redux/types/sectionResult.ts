import { ExamineeExam } from "./examineeExam";
import { ExamSection } from "./examSection";
import { User } from "./user";

export interface SectionResult {
  section_result_id: string;
  examinee_exam_id: string;
  section_id: string;
  examiner_id: string;
  score: number;
  remarks?: string | null;

  // Optional populated relations (when included from backend)
  examineeExam?: ExamineeExam;
  section?: ExamSection;
  examiner?: User;
}

/** Create Payload */
export interface CreateSectionResultPayload {
  examinee_exam_id: string;
  section_id: string;
  examiner_id: string;
  score: number;
  remarks?: string;
}

/** Update Payload */
export interface UpdateSectionResultPayload {
  score?: number;
  remarks?: string;
}
