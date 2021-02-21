import { ICommand } from "../../../../../../shared/core/ICQRS"

export class UpdateChannelCommandDTO implements ICommand {
    id: string;
    name?: string | null;
    lastMessageId?: string | null;
    description?: string | null;
    isPrivate?: boolean | null;
}
