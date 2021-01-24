import { Res } from "routing-controllers";
import { Response } from 'express'

export abstract class BaseController {
    public static JsonResponse(@Res() res: Response, data?: any) {
        return res.status(data.httpCode).json({ data })
    }

    public fail(@Res() res: Response, error: Error | string) {
        return BaseController.JsonResponse(res, error)
    }

    public created(@Res() res: Response, data?: any) {
        const response = {
            httpCode: 201,
            code: 'CREATED',
            id: data
        }
        return BaseController.JsonResponse(res, response)
    }
}
