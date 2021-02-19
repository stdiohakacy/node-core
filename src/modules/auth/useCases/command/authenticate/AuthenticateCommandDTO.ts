import { ICommand } from './../../../../../shared/core/ICQRS';
import { JWTToken } from "../../../../../shared/services/auth/TokenAlias";

export class AuthenticateCommandDTO implements ICommand {
    token: JWTToken
}
