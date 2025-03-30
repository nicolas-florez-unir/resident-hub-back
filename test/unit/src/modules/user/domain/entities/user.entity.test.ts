import { UserEntity } from '@user/domain/entities/User.entity';
import { UserRole } from '@user/domain/enums/UserRole.enum';

describe('UserEntity', () => {
  it('should create a user with valid properties', () => {
    const user = new UserEntity(
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Admin,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );

    expect(user.id).toBe(1);
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('securepassword');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.phone).toBe('1234567890');
    expect(user.role).toBe(UserRole.Admin);
    expect(user.createdAt).toEqual(new Date('2023-01-01'));
    expect(user.updatedAt).toEqual(new Date('2023-01-02'));
  });

  it('should return the full name of the user', () => {
    const user = new UserEntity(
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Admin,
      new Date(),
      new Date(),
    );

    expect(user.getFullName()).toBe('John Doe');
  });

  it('should update user properties', () => {
    const user = new UserEntity(
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Admin,
      new Date(),
      new Date(),
    );

    user.update('jane.doe@example.com', 'Jane', 'Doe', '0987654321');

    expect(user.email).toBe('jane.doe@example.com');
    expect(user.firstName).toBe('Jane');
    expect(user.lastName).toBe('Doe');
    expect(user.phone).toBe('0987654321');
  });
});
