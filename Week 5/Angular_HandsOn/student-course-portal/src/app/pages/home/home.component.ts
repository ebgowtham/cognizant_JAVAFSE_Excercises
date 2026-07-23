import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllCourses } from '../../store/course/course.selectors';
import { selectEnrolledIds } from '../../store/enrollment/enrollment.selectors';
import { CourseSummaryWidgetComponent } from '../../components/course-summary-widget/course-summary-widget.component';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, CourseSummaryWidgetComponent, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  portalName = 'Student Course Portal';
  isPortalActive = true;
  message = '';
  searchTerm = '';
  
  coursesCount = 0;
  enrolledCount = 0;

  constructor(
    private store: Store
  ) {}

  // Dynamic stats using getters
  get stats() {
    return {
      coursesAvailable: this.coursesCount,
      enrolled: this.enrolledCount,
      gpa: 3.8
    };
  }

  /*
   * DIFFERENCE BETWEEN [property] AND [(ngModel)]:
   *
   * [property] is a ONE-WAY property binding (Component -> DOM).
   * It binds a component property value to an element property.
   * If the property value in the component changes, the DOM is updated,
   * but user changes in the DOM (e.g. typing in an input) do not flow back to the component.
   *
   * [(ngModel)] is a TWO-WAY data binding (DOM <=> Component).
   * It combines property binding and event binding (shorthand for [ngModel] and (ngModelChange)).
   * Updates to the component property update the DOM, and user inputs in the DOM
   * update the component property in real-time.
   */

  ngOnInit(): void {
    console.log('HomeComponent initialised — courses loaded');
    // Subscribe to store selectors to sync local counts
    this.store.select(selectAllCourses).subscribe(c => this.coursesCount = c.length);
    this.store.select(selectEnrolledIds).subscribe(ids => this.enrolledCount = ids.length);
  }

  ngOnDestroy(): void {
    console.log('HomeComponent destroyed');
  }

  onEnrollClick(): void {
    this.message = 'Enrollment opened!';
  }
}
