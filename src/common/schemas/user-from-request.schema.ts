import * as Joi from 'joi';

export const UserFromRequestSchema = Joi.object({
  id: Joi.number().required(),
}).unknown(true);
