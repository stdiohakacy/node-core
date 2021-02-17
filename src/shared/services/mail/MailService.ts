import { Service } from 'typedi';
import { User } from '../../../modules/user/domain/aggregateRoot/User';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender/MailSender';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

export interface IMailService {
    sendUserActivation(user: User): Promise<void>;

    resendUserActivation(user: User): Promise<void>;

    sendForgotPassword(user: User): Promise<void>;
}


@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: MailSender;
    private readonly _generator: MailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml('', '', user.email.value, 'Account Activation', content);
    }

    async resendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml('', '', user.email.value, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(user: User): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml('', '', user.email.value, 'Forgot Your Password', content);
    }
}
