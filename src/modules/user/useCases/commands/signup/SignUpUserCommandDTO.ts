import { ICommand } from './../../../../../shared/core/ICQRS';

export class SignUpUserCommandDTO implements ICommand {
    firstName: string
    lastName?: string
    email: string
    password: string
}
