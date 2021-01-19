// export interface IUseCase<IRequest, IResponse> {
//     execute (request?: IRequest): Promise<IResponse> | IResponse;
// }

import { ICommand, IQuery } from "./ICQRS";

export interface IUseCaseCQRS<IRequest, IResponse> {
    execute (request?: IRequest): Promise<IResponse> | IResponse;
}

export interface IUseCaseCommandCQRS<IRequest extends ICommand, IResponse> {
    execute (request?: IRequest): Promise<IResponse> | IResponse;
}

export interface IUseCaseQueryCQRS<IRequest extends IQuery, IResponse> {
    execute (request?: IRequest): Promise<IResponse> | IResponse;
}