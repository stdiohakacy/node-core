import { ICommand } from "../../../../../shared/core/ICQRS"

export class ForgotPasswordUserCommandDTO implements ICommand {
    email: string
}
