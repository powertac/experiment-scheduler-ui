export enum NotificationLevel {
    info = 'INFO',
    warning = 'WARNING',
    error = 'ERROR',
}

export interface Notification {
    level: NotificationLevel;
    message: string;
}
