import Container from 'typedi';
import { Request, Response } from 'express';
import { Body, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams, Req, Res } from "routing-controllers";
import { MessageError, SystemError } from './../../../shared/exceptions/SystemError';
import { FindCategoriesUseCase } from './../useCases/queries/find/FindCategoriesUseCase';
import { FindCategoriesQueryDTO } from './../useCases/queries/find/FindCategoriesQueryDTO';
import { DeleteCategoryUseCase } from '../useCases/commands/delete/DeleteCategoryUseCase';
import { DeleteCategoryCommandDTO } from '../useCases/commands/delete/DeleteCategoryCommandDTO';
import { GetCategoryByIdUseCase } from '../useCases/queries/getById/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../useCases/commands/update/UpdateCategoryUseCase';
import { CreateCategoryUseCase } from "../useCases/commands/create/CreateCategoryUseCase";
import { GetCategoryByIdQueryDTO } from '../useCases/queries/getById/GetCategoryByIdQueryDTO';
import { CreateCategoryCommandDTO } from '../useCases/commands/create/CreateCategoryCommandDTO';
import { UpdateCategoryCommandDTO } from '../useCases/commands/update/UpdateCategoryCommandDTO';
import { CreateCategoryErrors } from "../useCases/commands/create/CreateCategoryErrors";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { ApplicationError } from '../../../shared/core/ApplicationError';
import { GetCategoryByIdErrors } from '../useCases/queries/getById/GetCategoryByIdErrors';
import { UpdateCategoryErrors } from '../useCases/commands/update/UpdateCategoryErrors';
import { DeleteCategoryErrors } from '../useCases/commands/delete/DeleteCategoryErrors';

@JsonController('/v1/categories')
export class UpdateCategoryController extends BaseController {
    constructor(
        private readonly _updateCategoryUseCase: UpdateCategoryUseCase = Container.get(UpdateCategoryUseCase),
    ) {super()}

    @Put('/:id([0-9a-f-]{36})')
    async executeImpl(@Body() param: UpdateCategoryCommandDTO, @Res() res: Response, @Param('id') id: string): Promise<Response> {
        param.id = id
        try {
            const result = await this._updateCategoryUseCase.execute(param);
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case UpdateCategoryErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case UpdateCategoryErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else
                return this.OK(res, resultValue.getValue())
        } 
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }

    // @Get('/')
    // async find(@QueryParams() param: FindCategoriesQueryDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._findCategoriesUseCase.execute(param)
    //         const resultValue = result.value

    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case ApplicationError.UnexpectedError:
    //                     throw new SystemError(MessageError.SOMETHING_WRONG)
    //             }
    //         }
    //         else {
    //             return this.OK(res, resultValue.getValue())
    //         }
    //     }
    //     catch (error) {
    //         console.error(error)
    //         return this.fail(res, error)
    //     }
    // }

    // @Get('/:id([0-9a-f-]{36})')
    // async getById(@Params() param: GetCategoryByIdQueryDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._getCategoryByIdUseCase.execute(param)
    //         const resultValue = result.value
            
    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case GetCategoryByIdErrors.NotFoundError:
    //                     throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'id')
    //                 case ApplicationError.UnexpectedError:
    //                     throw new SystemError(MessageError.SOMETHING_WRONG)
    //                 default:
    //                     return this.fail(res, resultValue.errorValue())
    //             }
    //         } else {
    //             return this.OK(res, resultValue.getValue())
    //         }
    //     }
    //     catch (error) {
    //         console.error(error)
    //         return this.fail(res, error)
    //     }
    // }

    // @Post('/')
    // async post(@Body() param: CreateCategoryCommandDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._createCategoryUseCase.execute(param)
    //         if(result.isLeft()) {
    //             const error = result.value

    //             switch (error.constructor) {
    //                 case CreateCategoryErrors.NameAlreadyExistsError:
    //                     return this.conflict(error.errorValue().message)
    //                 default:
    //                     return this.fail(res, error.errorValue().message)
    //             }
    //         }
    //         else
    //             return this.created(res)
    //         // const resultValue = result.value

    //         // if(result.isLeft()) {
    //         //     switch(resultValue.constructor) {
    //         //         case CreateCategoryErrors.NameAlreadyExistsError:
    //         //             throw new SystemError(MessageError.PARAM_EXISTED, 'name')
    //         //         case ApplicationError.UnexpectedError:
    //         //             throw new SystemError(MessageError.SOMETHING_WRONG)
    //         //         default:
    //         //             return this.fail(res, resultValue.errorValue())
    //         //     }
    //         // } else {
    //         //     return this.created(res, resultValue.getValue())
    //         // }
    //     }
    //     catch (error) {
    //         return this.fail(res, error)
    //     }
    // }

    // @Put('/:id([0-9a-f-]{36})')
    // async update(@Param('id') id: string, @Body() param: UpdateCategoryCommandDTO, @Res() res: Response): Promise<Response> {
    //     param.id = id;

    //     try {
    //         const result = await this._updateCategoryUseCase.execute(param);
    //         const resultValue = result.value

    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case UpdateCategoryErrors.NotFoundError:
    //                     throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'id')
    //                 case UpdateCategoryErrors.AlreadyExistsError:
    //                     throw new SystemError(MessageError.PARAM_EXISTED, 'name')
    //                 case ApplicationError.UnexpectedError:
    //                     throw new SystemError(MessageError.SOMETHING_WRONG)
    //                 default:
    //                     return this.fail(res, resultValue.errorValue())
    //             }
    //         }
    //         else {
    //             return this.OK(res, resultValue.getValue())
    //         }
    //     } 
    //     catch (error) {
    //         return this.fail(res, error)
    //     }
    // }
    
    // @Delete('/:id([0-9a-f-]{36})')
    // async delete(@Params() param: DeleteCategoryCommandDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._deleteCategoryUseCase.execute(param)
    //         const resultValue = result.value

    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case DeleteCategoryErrors.NotFoundError:
    //                     throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'id')
    //                 case ApplicationError.UnexpectedError:
    //                     throw new SystemError(MessageError.SOMETHING_WRONG)
    //                 default:
    //                     return this.fail(res, resultValue.errorValue())
    //             }
    //         } else {
    //             return this.OK(res, resultValue.getValue())
    //         }
    //     } 
    //     catch (error) {
    //         console.error(error)
    //         return this.fail(res, error)
    //     }
    // }
}
