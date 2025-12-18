import { Exam } from "./exam";
export interface ExamSection {
  section_id: string;
  exam_id: string;
  name: string;
  weight_percentage: number;
  is_active: boolean;
  max_score: number;
  created_at: string;
  exam?: Exam;
}

export interface CreateExamSectionPayload {
  exam_id: string;
  name: string;
  weight_percentage: number;
  max_score?: number;
}

export interface UpdateExamSectionPayload {
  name?: string;
  weight_percentage?: number;
  max_score?: number;
}
