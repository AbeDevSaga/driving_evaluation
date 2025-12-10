export interface RolePermission {
  role_permission_id: string;
  permission: {
    permission_id: string;
    resource: string;
    action: string;
  };
}

export interface Role {
  role_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  rolePermissions: RolePermission[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permission_ids?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permission_ids?: string[];
}
