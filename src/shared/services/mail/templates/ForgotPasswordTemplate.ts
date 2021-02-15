import { User } from './../../../../modules/user/domain/aggregateRoot/User';
import * as Mailgen from 'mailgen';

export class ForgotPasswordTemplate {
    static getTemplate(user: User): Mailgen.Content {
        return {
            body: {
                name: `${user.firstName && user.firstName.value || ''} ${user.lastName && user.lastName.value || ''}`,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Reset your password',
                        link: `${'http'}://${'localhost'}/reset-password?email=${user.email.value}&key=${user.forgotKey.value}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };
    }
}
