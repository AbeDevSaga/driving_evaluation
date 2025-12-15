// ==========================
// Vehicle Category Entity
// ==========================
export interface VehicleCategory {
  vehicle_category_id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==========================
// Create Payload
// ==========================
export interface CreateVehicleCategoryPayload {
  name: string;
  description?: string | null;
}

// ==========================
// Update Payload
// ==========================
export interface UpdateVehicleCategoryPayload {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

// ==========================
// Toggle Status Payload
// ==========================
export interface ToggleVehicleCategoryStatusPayload {
  is_active: boolean;
}
