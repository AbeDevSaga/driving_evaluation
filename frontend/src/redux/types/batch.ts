// types/batch.ts

import { User } from "./user";
import { VehicleCategory } from "./vehicleCategory";

export interface Batch {
  batch_id: string;
  vehicle_category_id: string;

  batch_code: string;
  name: string;
  year: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;

  /** Optional populated relations */
  vehicleCategory?: VehicleCategory;
  users?: User[];
}

/** Payload for creating batch */
export interface CreateBatchPayload {
  vehicle_category_id: string;
  batch_code: string;
  name: string;
  year: number;
}

/** Payload for updating batch */
export interface UpdateBatchPayload {
  batch_code?: string;
  name?: string;
  year?: number;
  is_active?: boolean;
}
