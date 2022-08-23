import { UserType } from './user.type';

export interface CreateUserResponseInterface {
  user: UserType // & { token: string }; TODO for the future authorization
}