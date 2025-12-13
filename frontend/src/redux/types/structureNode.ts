// ==========================
// Structure Node Entity
// ==========================
export interface StructureNode {
  structure_node_id: string; // Unique ID
  parent_id?: string | null; // Parent node ID (nullable)
  name: string; // Node name
  description?: string | null; // Optional description
  level: number; // Hierarchy level
  is_active: boolean; // Active status
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at?: string | null; // Soft delete timestamp
  children?: StructureNode[]; // Optional children for nested structure
}

// ==========================
// Create Payload
// ==========================
export interface CreateStructureNodePayload {
  parent_id?: string | null;
  name: string;
  description?: string | null;
  level?: number;
  is_active?: boolean;
}

// ==========================
// Update Payload
// ==========================
export interface UpdateStructureNodePayload {
  parent_id?: string | null;
  name?: string;
  description?: string | null;
  level?: number;
  is_active?: boolean;
}

// ==========================
// Toggle Status Payload
// ==========================
export interface ToggleStructureNodeStatusPayload {
  is_active: boolean;
}
