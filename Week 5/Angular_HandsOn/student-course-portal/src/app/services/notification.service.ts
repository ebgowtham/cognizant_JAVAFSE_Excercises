import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private notifications: string[] = [];

  constructor() {
    console.log('NotificationService instance created!');
  }

  send(message: string): void {
    this.notifications.push(message);
  }

  getNotifications(): string[] {
    return this.notifications;
  }
}
