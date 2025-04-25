process.env.APP_PORT = '123';
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.ENCRYPT_SALT_ROUNDS = '2';

process.env.JWT_ACCESS_SECRET = 'access-secret';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_SECRET = 'refresh-secret';
process.env.JWT_REFRESH_EXPIRATION = '8h';

process.env.DEFAULT_USER_PASSWORD = 'residenthub314*';
process.env.PRIVATE_API_SECRET = 'private_api_secret';
