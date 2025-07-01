import { UserRole } from '@user/domain/enums/user-role.enum';

export interface UserFromRequestInterface {
  id: number;
  condominium_id: number;
  role: UserRole;
}
