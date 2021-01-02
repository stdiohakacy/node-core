import { IUseCase } from "../../../core/IUserCase";

export abstract class BaseController<IRequest, IResponse> {
    constructor(private readonly _useCase: IUseCase<IRequest, IResponse>) {
        this._useCase = _useCase
    }
}
