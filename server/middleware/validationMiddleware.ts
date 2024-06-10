import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

import { StatusCodes } from 'http-status-codes'

export const validateData = (schema: ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map((issue: any) => ({
					message: `${issue.path.join('.')} is ${issue.message}`,
				}))
				res.status(StatusCodes.BAD_REQUEST).json({ errors: errorMessages })
			} else {
				res
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.json({ error: 'Internal Server Error' })
			}
		}
	}
}
