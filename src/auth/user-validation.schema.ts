import Joi from 'joi'
import { ILoginData, IRegistrationData } from './interface/auth.service.interface'

export const registrationSchema = Joi.object<IRegistrationData, true>({
	name: Joi.string().min(2).max(255).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required()
})

export const loginSchema = Joi.object<ILoginData, true>({
	email: Joi.string().email().required(),
	password: Joi.string().required()
})