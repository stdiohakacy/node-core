export enum LogProvider {
    CONSOLE = 1,
    LOG_FILE = 2
}

export enum StorageProvider {
    CONSOLE = 1,
    MINIO = 2,
    AWS_S3 = 3,
    GOOGLE_STORAGE = 4
}

export enum MailProvider {
    CONSOLE = 1,
    GOOGLE_SMTP = 2,
    MAIL_GUN = 3,
    SEND_IN_BLUE = 4,
    MAIL_TRAP = 5
}

export enum SmsProvider {
    CONSOLE = 1,
    TWILIO = 2,
    SEND_IN_BLUE = 3
}

export enum NotificationProvider {
    CONSOLE = 1,
    NODE_PUSH_NOTIFICATION = 2
}
