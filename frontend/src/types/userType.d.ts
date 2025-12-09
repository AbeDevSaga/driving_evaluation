
export interface User {
    id: string;
    name: string;
    email: string;
  }

  export interface UserListParams {
    page: number;
    limit: number;
    search: string;
  }