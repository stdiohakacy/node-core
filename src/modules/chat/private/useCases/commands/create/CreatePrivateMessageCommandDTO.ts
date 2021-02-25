import { ICommand } from '../../../../../../shared/core/ICQRS';

export class CreatePrivateMessageCommandDTO implements ICommand {
    fromUserId: string
    toUserId: string
    message: string
}
