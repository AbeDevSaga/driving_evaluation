export interface Exam {
  exam_id: string;
  name: string;
  description?: string | null;
  pass_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateExamPayload {
  name: string;
  description?: string;
  pass_percentage: number;
}

export interface UpdateExamPayload {
  name?: string;
  description?: string;
  pass_percentage?: number;
  is_active?: boolean;
}

export interface ToggleExamStatusPayload {
  is_active: boolean;
}
