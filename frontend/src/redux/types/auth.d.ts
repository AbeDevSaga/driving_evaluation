export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Permission {
  permission_id: string;
  name: string;
  key: string;
}

export interface Role {
  role_id: string;
  name: string;
  is_active?: boolean;
  permissions: Permission[];
}

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  profile_image: string | null;
  is_first_logged_in: boolean;
}

// Auth Response Matching The Backend
export interface AuthResponse {
  token: string;
  user: User | null;
  roles: Role[];
  message: string;
}
