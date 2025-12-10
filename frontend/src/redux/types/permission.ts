export interface Permission {
  permission_id: string;
  name: string;
  key: string;
  resource: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}
