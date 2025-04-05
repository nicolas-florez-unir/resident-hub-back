import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService as NestJwtService } from '@nestjs/jwt'; // Importa el servicio real de NestJS
import { ApplicationJwtService } from '@auth/infrastructure/jwt/application-jwt.service';
import { UserRole } from '@user/domain/enums/UserRole.enum';

describe('JwtService', () => {
  let applicationJwtService: ApplicationJwtService;
  let nestJwtService: NestJwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'random_secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        ApplicationJwtService, // El servicio que vamos a probar
      ],
    }).compile();

    applicationJwtService = module.get<ApplicationJwtService>(
      ApplicationJwtService,
    );
    nestJwtService = module.get<NestJwtService>(NestJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const payload = {
        id: 1,
        condominium_id: 1,
        role: UserRole.Administrator,
      };

      const mockToken = 'mock-token';

      jest.spyOn(nestJwtService, 'sign').mockReturnValue('mock-token'); // Espiar el método sign para poder mockearlo

      const result = applicationJwtService.generateToken(payload);

      expect(result).toBe(mockToken); // Verificar que el resultado sea el token esperado
      expect(nestJwtService.sign).toHaveBeenCalledWith(payload); // Verificar que se haya llamado con el payload correcto
    });
  });

  describe('validateToken', () => {
    it('should validate a token', () => {
      const token = 'mock-token';

      jest.spyOn(nestJwtService, 'verify').mockReturnValue({});

      const result = applicationJwtService.validateToken(token);

      expect(result).toBe(true); // Verificar que el resultado es el payload decodificado
      expect(nestJwtService.verify).toHaveBeenCalledWith(token); // Verificar que se haya llamado con el token correcto
    });

    it('should return false if token is invalid', () => {
      const token = 'mock-token';

      jest.spyOn(nestJwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = applicationJwtService.validateToken(token);

      expect(result).toBe(false); // Verificar que el resultado es el payload decodificado
      expect(nestJwtService.verify).toHaveBeenCalledWith(token); // Verificar que se haya llamado con el token correcto

      jest.clearAllMocks();
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', async () => {
      const token = 'mock-token';
      const mockDecoded = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      jest.spyOn(nestJwtService, 'decode').mockReturnValue(mockDecoded); // Espiar el método decode para poder mockearlo

      const result = await applicationJwtService.decodeToken(token);

      expect(result).toBe(mockDecoded); // Verificar que el resultado es el payload decodificado
      expect(nestJwtService.decode).toHaveBeenCalledWith(token); // Verificar que se haya llamado con el token correcto
    });
  });
});
