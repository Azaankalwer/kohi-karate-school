export interface Login {
  id: string;
  email: string;
  password: string;
}

export interface CreateLoginInput {
  email: string;
  password: string;
}