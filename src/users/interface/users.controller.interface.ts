import { NextFunction, Request, Response } from 'express'

export class IUserController {
	getAll: (req: Request, res: Response, next: NextFunction) => void
	updateUserRole: (req: Request, res: Response, next: NextFunction) => void
	deleteUserById: (req: Request, res: Response, next: NextFunction) => void
}
