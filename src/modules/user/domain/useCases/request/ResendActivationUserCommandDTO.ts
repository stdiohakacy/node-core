import { ICommand } from "../../../../../shared/core/ICQRS";

export class ResendActivationUserCommandDTO implements ICommand {
    email: string
}
