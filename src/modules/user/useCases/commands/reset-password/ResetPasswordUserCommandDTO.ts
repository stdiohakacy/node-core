import { ICommand } from "../../../../../shared/core/ICQRS"

export class ResetPasswordUserCommandDTO implements ICommand {
    forgotKey: string
    email: string
    password: string
}
