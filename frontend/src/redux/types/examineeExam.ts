export interface ExamineeExam {
  examinee_exam_id: string;
  examinee_id: string;
  exam_id: string;
  exam_schedule_id: string;
  total_score?: number | null;
  is_passed?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateExamineeExamPayload {
  examinee_ids: string[];
  exam_id: string;
  schedule_id: string;
  total_score?: number;
  is_passed?: boolean;
}

export interface UpdateExamineeExamPayload {
  schedule_id?: string;
  total_score?: number;
  is_passed?: boolean;
}
