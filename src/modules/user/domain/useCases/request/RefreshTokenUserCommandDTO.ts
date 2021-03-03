import { RefreshToken } from '../../../../../shared/services/auth/TokenAlias';
import { ICommand } from "../../../../../shared/core/ICQRS"

export class RefreshTokenUserCommandDTO implements ICommand {
    refreshToken: RefreshToken
}
