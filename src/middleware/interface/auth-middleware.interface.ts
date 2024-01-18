import { NextFunction, Request, Response } from 'express'

export interface IAuthMiddleware {
	useAuth: (req: IAuthRequest, res: Response, next: NextFunction) => void
}

export interface IAuthRequest extends Request {
	user?: currentUser;
}

interface currentUser {
	id: number;
	role: string
}