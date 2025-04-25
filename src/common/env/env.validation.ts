import * as joi from 'joi';

process.loadEnvFile('.env');

interface EnvVars {
  APP_PORT: number;
  DATABASE_URL: string;
  ENCRYPT_SALT_ROUNDS: number;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  PRIVATE_API_SECRET: string;
  DEFAULT_USER_PASSWORD: string;
}

const envsSchema = joi
  .object({
    APP_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    ENCRYPT_SALT_ROUNDS: joi.number().required(),
    JWT_ACCESS_SECRET: joi.string().required(),
    JWT_ACCESS_EXPIRATION: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_REFRESH_EXPIRATION: joi.string().required(),
    PRIVATE_API_SECRET: joi.string().required(),
    DEFAULT_USER_PASSWORD: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  appPort: envVars.APP_PORT,
  databaseUrl: envVars.DATABASE_URL,
  encryptSaltRounds: envVars.ENCRYPT_SALT_ROUNDS,
  jwt: {
    access: {
      secret: envVars.JWT_ACCESS_SECRET,
      expiration: envVars.JWT_ACCESS_EXPIRATION,
    },
    refresh: {
      secret: envVars.JWT_REFRESH_SECRET,
      expiration: envVars.JWT_REFRESH_EXPIRATION,
    },
  },
  defaultUserPassword: envVars.DEFAULT_USER_PASSWORD,
  privateApiSecret: envVars.PRIVATE_API_SECRET,
};
