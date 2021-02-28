import { ICommand } from './../../../shared/core/ICQRS';

export class CreateChannelCommandDTO implements ICommand {
    name?: string
    description?: string
    userIds: string[]
}
