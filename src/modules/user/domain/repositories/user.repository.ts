import { CreateUserDto } from '../dtos/CreateUserDto';
import { UserEntity } from '../entities/User.entity';

export abstract class UserRepository {
  abstract create(dto: CreateUserDto): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract update(user: UserEntity): Promise<UserEntity | null>;
}
