import { Service } from 'typedi';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { UserActivationTemplate } from './templates/UserActivationTemplate';
import { MailGenerator } from './MailGenerator';
import { User } from "../../../modules/user/domain/aggregateRoot/User";
import { IMailService } from "./sender/interfaces/IMailService";
import { MailSender } from "./sender/MailSender";

@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: MailSender
    private readonly _generator: MailGenerator

    constructor() {
        this._sender = new MailSender()
        this._generator = new MailGenerator()
    }
    
    async sendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml('Admin Node Core', 'admin@node-core.com', user.email.value, 'Account Activation', content);
    }

    async resendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user)
        const content = this._generator.generateHtmlContent(template)
        await this._sender.sendHtml('Admin Node Core', 'admin@node-core.com',user.email.value, 'Re sending Account Activation', content)
    }
    
    async sendForgotPassword(user: User): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml('Admin Node Core', 'admin@node-core.com', user.email.value, 'Forgot Your Password', content);
    }
}
