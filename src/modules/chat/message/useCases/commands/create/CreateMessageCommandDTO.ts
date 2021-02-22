import { ICommand } from "../../../../../../shared/core/ICQRS"

export class CreateMessageCommandDTO implements ICommand {
    userId: string
    channelId: string
    content: string
}
