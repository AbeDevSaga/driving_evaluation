export interface ExaminerAssignment {
  assignment_id: string;
  examiner_id: string;
  section_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateExaminerAssignmentPayload {
  examiner_id: string;
  section_id: string;
}

export interface UpdateExaminerAssignmentPayload {
  examiner_id?: string;
  section_id?: string;
}
