import * as Mailgen from 'mailgen';
import { User } from '../../../../modules/user/domain/aggregateRoot/User';

export class UserActivationTemplate {
    static getTemplate(user: User): Mailgen.Content {
        return {
            body: {
                name: `${user.firstName && user.firstName.value || ''} ${user.lastName && user.lastName.value || ''}`,
                intro: `Welcome to ${'Node core'}! We're very excited to have you on board.`,
                action: {
                    instructions: `To get started with ${'Node core'}, please click here:`,
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${'http'}://${'localhost'}/confirm-account?email=${user.email && user.email.value || ''}&key=${user.activeKey && user.activeKey.value || ''}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
    }
}
