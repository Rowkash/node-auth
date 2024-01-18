import { ITokens } from '@/auth/interface/tokens.interface';

export interface IRegistration extends ITokens {
  user: {
    id: number;
    email: string;
  };
}

export interface IRegistrationData {
  name: string;
  email: string;
  password: string;
}

export type ILoginData = Omit<IRegistrationData, 'name'>;
