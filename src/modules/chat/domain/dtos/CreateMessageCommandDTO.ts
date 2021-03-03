import { MESSAGE_STATUS } from '../definition/MessageStatus';
import { MESSAGE_TYPE } from '../definition/MessageType';
import { ICommand } from '../../../../shared/core/ICQRS';

export class CreateMessageCommandDTO implements ICommand {
    channelId: string;
    content?: string;
    type: MESSAGE_TYPE;
    status: MESSAGE_STATUS;
    isPin?: boolean;
    isStar?: boolean;
}
