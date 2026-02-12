import * as Joi from 'joi'

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(32),
  JWT_REFRESH_SECRET: Joi.string().required().min(32),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),
  PISTON_URL: Joi.string().default('https://emkc.org/api/v2/piston/execute'),
  YOOKASSA_SHOP_ID: Joi.string().optional(),
  YOOKASSA_SECRET_KEY: Joi.string().optional(),
  APP_EXTERNAL_URL: Joi.string().default('http://localhost:3001'),
})
