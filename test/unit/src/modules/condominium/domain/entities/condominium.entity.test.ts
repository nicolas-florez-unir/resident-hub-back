import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserRole } from '@user/domain/enums/user-role.enum';

describe('CondominiumEntity', () => {
  let condominium: CondominiumEntity;

  beforeEach(() => {
    condominium = new CondominiumEntity(
      1,
      'Condo Name',
      '123 Main St',
      null,
      null,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );
  });

  it('should get and set id', () => {
    expect(condominium.getId()).toBe(1);
    condominium.setId(2);
    expect(condominium.getId()).toBe(2);
  });

  it('should get and set name', () => {
    expect(condominium.getName()).toBe('Condo Name');
    condominium.setName('New Condo Name');
    expect(condominium.getName()).toBe('New Condo Name');
  });

  it('should get and set address', () => {
    expect(condominium.getAddress()).toBe('123 Main St');
    condominium.setAddress('456 Elm St');
    expect(condominium.getAddress()).toBe('456 Elm St');
  });

  it('should get and set createdAt', () => {
    expect(condominium.getCreatedAt()).toEqual(new Date('2023-01-01'));
    const newDate = new Date('2023-02-01');
    condominium.setCreatedAt(newDate);
    expect(condominium.getCreatedAt()).toEqual(newDate);
  });

  it('should get and set updatedAt', () => {
    expect(condominium.getUpdatedAt()).toEqual(new Date('2023-01-02'));
    const newDate = new Date('2023-02-02');
    condominium.setUpdatedAt(newDate);
    expect(condominium.getUpdatedAt()).toEqual(newDate);
  });

  it('should get and set administrator', () => {
    expect(condominium.getAdministrator()).toBeNull();
    const user = new UserEntity(
      1,
      1,
      'admin@example.com',
      'password',
      'John',
      'Doe',
      '1234567890',
      UserRole.Administrator,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );
    condominium.setAdministrator(user);
    expect(condominium.getAdministrator()).toBe(user);
  });

  it('should set logo', () => {
    const logo = 'logo.png';
    condominium.setLogo(logo);
    expect(condominium.getLogo()).toBe(logo);
  });
});
