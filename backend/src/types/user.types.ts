// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  provider: 'EMAIL' | 'GOOGLE' | 'GITHUB';
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  passwordHash: string;
  provider?: 'EMAIL' | 'GOOGLE' | 'GITHUB';
  avatar?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
