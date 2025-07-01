import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(dto: CreateUserDto): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract update(user: UserEntity): Promise<UserEntity | null>;
  abstract findAdministratorById(id): Promise<UserEntity | null>;
  abstract findOwnersByCondominiumId(condominiumId: number): Promise<UserEntity[]>;
  abstract delete(id: number): Promise<void>;
}
