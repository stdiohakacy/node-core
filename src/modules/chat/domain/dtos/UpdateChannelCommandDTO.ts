import { ICommand } from '../../../../shared/core/ICQRS';

export class UpdateChannelCommandDTO implements ICommand { 
  id: string;
  name?: string;
  lastMessageId?: string;
  description?: string;
  isPrivate?: boolean
}
