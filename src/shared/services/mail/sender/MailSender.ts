import { MailType } from './../config/MailType';
import { MailConsoleFactory } from './implementation/MailConsoleFactory';
import { MAIL_PROVIDER } from './../../../../configs/Configuration';
import { IMailProvider } from './interfaces/IMailProvider';

export class MailSender implements IMailProvider {
    private readonly _mailProvider: IMailProvider

    constructor() {
        switch (MAIL_PROVIDER) {
            case MailType.CONSOLE:
            default:
                this._mailProvider = new MailConsoleFactory()
                break;
        }
    }

    send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this._mailProvider.send(senderName, senderEmail, emails, subject, content)
    }
    
    sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this._mailProvider.sendHtml(senderName, senderEmail, emails, subject, htmlContent);
    }
}
