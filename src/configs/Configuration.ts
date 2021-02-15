import { MailType } from './../shared/services/mail/config/MailType';

// MAIL SERVICE
export const MAIL_PROVIDER: number = process.env.MAIL_PROVIDER ? Number(process.env.MAIL_PROVIDER) : MailType.CONSOLE;
