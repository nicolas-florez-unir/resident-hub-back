import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService as NestJwtService } from '@nestjs/jwt'; // Importa el servicio real de NestJS
import { ApplicationJwtService } from '@auth/infrastructure/jwt/application-jwt.service';
import { UserRole } from '@user/domain/enums/user-role.enum';

describe('JwtService', () => {
  let applicationJwtService: ApplicationJwtService;
  let nestJwtService: NestJwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        ApplicationJwtService, // El servicio que vamos a probar
      ],
    }).compile();

    applicationJwtService = module.get<ApplicationJwtService>(ApplicationJwtService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  describe('generateAccessToken', () => {
    it('should generate a token', async () => {
      const payload = {
        id: 1,
        condominium_id: 1,
        role: UserRole.Administrator,
      };

      const mockToken = 'mock-token';

      // Espiar el método sign para poder mockearlo
      jest.spyOn(nestJwtService, 'sign').mockReturnValue('mock-token');

      const result = applicationJwtService.generateAccessToken(payload);

      expect(result).toBe(mockToken); // Verificar que el resultado sea el token esperado
      expect(nestJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        secret: process.env.JWT_ACCESS_SECRET,
      }); // Verificar que se haya llamado con el payload correcto
    });
  });

  describe('validateAccessToken', () => {
    it('should validate a token', () => {
      const token = 'mock-token';

      jest.spyOn(nestJwtService, 'verify').mockReturnValue({});

      const result = applicationJwtService.validateAccessToken(token);

      expect(result).toBe(undefined); // Verificar que el resultado es el payload decodificado
      expect(nestJwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      }); // Verificar que se haya llamado con el token correcto
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a token', () => {
      const token = 'mock-token';

      jest.spyOn(nestJwtService, 'verify').mockReturnValue({});

      const result = applicationJwtService.validateRefreshToken(token);

      expect(result).toBe(undefined); // Verificar que el resultado es el payload decodificado
      expect(nestJwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      }); // Verificar que se haya llamado con el token correcto
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', async () => {
      const token = 'mock-token';
      const mockDecoded = {
        id: 1,
        role: UserRole.Administrator,
        condominium_id: 1,
      };

      // Espiar el método decode para poder mockearlo
      jest.spyOn(nestJwtService, 'decode').mockReturnValue(mockDecoded);

      const result = await applicationJwtService.decodeToken(token);

      // Verificar que el resultado es el payload decodificado
      expect(result).toEqual(mockDecoded);
      // Verificar que se haya llamado con el token correcto
      expect(nestJwtService.decode).toHaveBeenCalledWith(token);
    });
  });
});
