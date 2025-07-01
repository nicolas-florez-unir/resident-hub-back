import { UserEntity } from '@user/domain/entities/user.entity';
import { UserRole } from '@user/domain/enums/user-role.enum';

describe('UserEntity', () => {
  it('should create a user with valid properties', () => {
    const user = new UserEntity(
      1,
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Administrator,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );

    expect(user.id).toBe(1);
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('securepassword');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.phone).toBe('1234567890');
    expect(user.role).toBe(UserRole.Administrator);
    expect(user.createdAt).toEqual(new Date('2023-01-01'));
    expect(user.updatedAt).toEqual(new Date('2023-01-02'));
  });

  it('should return the full name of the user', () => {
    const user = new UserEntity(
      1,
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Administrator,
      new Date(),
      new Date(),
    );

    expect(user.getFullName()).toBe('John Doe');
  });

  it('should update user properties', () => {
    const user = new UserEntity(
      1,
      1,
      'john.doe@example.com',
      'securepassword',
      'John',
      'Doe',
      '1234567890',
      UserRole.Administrator,
      new Date(),
      new Date(),
    );

    user.update('jane.doe@example.com', 'Jane', 'Doe', '0987654321');

    expect(user.email).toBe('jane.doe@example.com');
    expect(user.firstName).toBe('Jane');
    expect(user.lastName).toBe('Doe');
    expect(user.phone).toBe('0987654321');
  });

  describe('isAdministrator method', () => {
    const dataSet = [
      { role: UserRole.Administrator, expected: true },
      { role: UserRole.HouseOwner, expected: false },
      { role: null, expected: false },
      { role: false, expected: false },
      { role: 0, expected: false },
    ];

    it.each(dataSet)(
      'should return $expected when role is $role',
      ({ role, expected }) => {
        const user = new UserEntity(
          1,
          1,
          'john.doe@example.com',
          'securepassword',
          'John',
          'Doe',
          '1234567890',
          // Even if the role is not a valid UserRole, we enforce it
          role as UserRole,
          new Date(),
          new Date(),
        );

        expect(user.isAdministrator()).toBe(expected);
      },
    );
  });
});
