import { ICommand } from "../../../../../shared/core/ICQRS"

export class LoginCommandDTO implements ICommand {
    email: string
    password: string
}
