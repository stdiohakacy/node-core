import { Req, Res } from "routing-controllers";
import { Response } from 'express'
import { ICQRS } from "../../../core/ICQRS";

export abstract class BaseController {
    protected abstract executeImpl (req: ICQRS, res: Response, param?: string | ICQRS): Promise<void | any>;

    public async execute (req: ICQRS, @Res() res: Response, param?: string): Promise<void> {
        try {
            await this.executeImpl(req, res, param);
        } catch (err) {
            console.log(`[BaseController]: Uncaught controller error`);
            console.log(err);
            this.fail(res, 'An unexpected error occurred')
        }
    }

    public static jsonResponse (@Res() res: Response, code: number, message: string) {
        return res.status(code).json({ message })
    }
    
    public OK<T> (@Res() res: Response, dto?: T) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json({data: dto});
        } 
        return res.sendStatus(200);
    }
    
    public created(@Res() res: Response, data: string) {
        return res.status(201).json({ data })
    }
    
    public clientError(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 400, message || 'Unauthorized');
    }
    
    public unAuthorized(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 401, message || 'Unauthorized');
    }
    
    public paymentRequired(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 402, message || 'Payment required');
    }
    
    public forbidden(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 403, message || 'Forbidden');
    }
    
    public notFound(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 404, message || 'Not found');
    }

    public conflict(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 409, message || 'Conflict');
    }

    public tooMany(@Res() res: Response, message?: string) {
        return BaseController.jsonResponse(res, 429, message || 'Too many requests');
    }

    public todo(@Res() res: Response) {
        return BaseController.jsonResponse(res, 400, 'TODO');
    }
    
    public fail(@Res() res: Response, error: Error | string) {
        return res.status(500).json({
            message: error.toString()
        })
    }
}
