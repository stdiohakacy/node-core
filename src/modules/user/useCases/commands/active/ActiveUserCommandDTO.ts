import { ICommand } from "../../../../../shared/core/ICQRS"

export class ActiveUserCommandDTO implements ICommand {
    email: string
    activeKey: string
}
