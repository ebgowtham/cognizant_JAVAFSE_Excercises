import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  portalName = 'Student Course Portal';
  isPortalActive = true;
  searchTerm = '';
  message = '';

  onEnrollClick() {
    this.message = 'Enrollment opened!';
  }

  /*
   * DIFFERENCE BETWEEN [property] AND [(ngModel)]:
   * 
   * [property] (One-Way Binding: Component -> DOM):
   * This is a one-way binding that flows data from the component's TypeScript class
   * to the DOM. When the component property changes, Angular updates the bound DOM
   * element property. However, changes in the DOM (e.g., user input or interaction)
   * do not automatically propagate back to update the component property.
   *
   * [(ngModel)] (Two-Way Binding: DOM <-> Component):
   * This is two-way data binding, which synchronizes the component's property and the
   * DOM element value in both directions. It is a combination of property binding and
   * event binding: [ngModel]="value" (ngModelChange)="value = $event". When the component
   * property changes, the UI updates; when the user types or interacts with the input,
   * the component property is updated in real time.
   */
}
