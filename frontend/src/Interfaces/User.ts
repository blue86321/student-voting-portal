export default interface User {
  id: number;
  email: string;
  dob: string;
  staff: boolean;
  superuser: boolean;
}

export interface Token {
  access: string;
  refresh: string;
}

export interface University {
  id: number;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: Token;
  university: University;
}

export interface CreateUserParams {
  email: string,
  password: string,
  passwordConfirm: string,
  universityId: number,
  dob: Date,
  admin: Boolean
}