import { ICommand, IQuery } from "./ICQRS";

export interface IUseCaseCQRS {
    execute()
}

export interface IUseCaseCommandCQRS<IRequest extends ICommand, IResponse> extends IUseCaseCQRS {
    execute (request?: IRequest): Promise<IResponse> | IResponse;
}

export interface IUseCaseQueryCQRS<IRequest extends IQuery, IResponse> extends IUseCaseCQRS {
    execute (request?: IRequest): Promise<IResponse> | IResponse;
}