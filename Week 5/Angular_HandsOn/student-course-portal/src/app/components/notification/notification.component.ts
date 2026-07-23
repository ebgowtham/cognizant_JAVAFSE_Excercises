import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  providers: [NotificationService], // Scoped service provider
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  
  /*
   * WHY THIS CREATES A NEW, SEPARATE INSTANCE SCOPED TO THIS COMPONENT:
   * By declaring a service in the `providers` array of a `@Component` decorator instead of using
   * `providedIn: 'root'`, we register the provider with the component's element injector.
   * Angular will instantiate a new, separate instance of `NotificationService` for every instance
   * of `NotificationComponent` that is created. This instance is scoped to the component lifecycle
   * and is not shared globally, allowing for isolated component state.
   */
  constructor(public notificationService: NotificationService) {}

  addNotification(inputVal: string): void {
    if (inputVal.trim()) {
      this.notificationService.send(inputVal);
    }
  }
}
