/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: number;
  is_active: number;
  username: string;
  name: string;
  email: string;
  mobile: string;
  email_verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Array<{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: any;
  }>;
  permissions: any[];
}

export interface LoginResponse {
  token: string;
  roles: string[];
  permissions: string[];
  user: User;
}
