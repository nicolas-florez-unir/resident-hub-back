import { UserRole } from '@user/domain/enums/user-role.enum';
import * as Joi from 'joi';

export const UserFromRequestSchema = Joi.object({
  id: Joi.number().required(),
  condominium_id: Joi.number().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
}).unknown(true);
