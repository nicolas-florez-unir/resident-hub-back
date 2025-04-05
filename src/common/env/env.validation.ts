import * as joi from 'joi';

process.loadEnvFile('.env');

interface EnvVars {
  APP_PORT: number;
  DATABASE_URL: string;
  ENCRYPT_SALT_ROUNDS: number;
  JWT_SECRET: string;
  PRIVATE_API_SECRET: string;
  DEFAULT_USER_PASSWORD: string;
}

const envsSchema = joi
  .object({
    APP_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    ENCRYPT_SALT_ROUNDS: joi.number().required(),
    JWT_SECRET: joi.string().required(),
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
  jwtSecret: envVars.JWT_SECRET,
  defaultUserPassword: envVars.DEFAULT_USER_PASSWORD,
  privateApiSecret: envVars.PRIVATE_API_SECRET,
};
