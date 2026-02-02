import { StructureNode } from "./structureNode";
import { VehicleCategory } from "./vehicleCategory";

export interface Exam {
  exam_id: string;
  name: string;
  description?: string | null;
  pass_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vehicleCategory?: VehicleCategory;
  structure?: StructureNode;
  structureNode?: StructureNode;
  
}

export interface CreateExamPayload {
  name: string;
  description?: string;
  pass_percentage: number;
  vehicle_category_id: string;
  structure_node_id: string;
}

export interface UpdateExamPayload {
  name?: string;
  description?: string;
  pass_percentage?: number;
  vehicle_category_id?: string;
  is_active?: boolean;
}

export interface ToggleExamStatusPayload {
  is_active: boolean;
}
