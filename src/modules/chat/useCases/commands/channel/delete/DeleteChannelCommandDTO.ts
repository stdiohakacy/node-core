import { ICommand } from "../../../../../../shared/core/ICQRS";

export class DeleteChannelCommandDTO implements ICommand {
    id: string
}
