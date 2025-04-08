import { UserRole } from '@user/domain/enums/UserRole.enum';

export interface UserFromRequestInterface {
  id: number;
  condominium_id: number;
  role: UserRole;
}
