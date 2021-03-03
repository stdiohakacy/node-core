import { ICommand } from "../../../../../shared/core/ICQRS"

export class LogoutUserCommandDTO implements ICommand {
    userId: string
}
