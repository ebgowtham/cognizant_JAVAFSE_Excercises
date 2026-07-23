import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../pages/course-list/course-list.component';
import { CreditLabelPipe } from '../../pipes/credit-label.pipe';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule, CreditLabelPipe],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Output() courseSelected = new EventEmitter<string>();
  isExpanded = false;

  onSelect() {
    this.courseSelected.emit(this.course.title);
  }

  toggleDetails() {
    this.isExpanded = !this.isExpanded;
  }

  /*
   * WHY GETTERS KEEP TEMPLATES CLEAN:
   * Instead of writing complex conditional logical expressions directly inside the template
   * (e.g., [ngClass]="{ 'card--enrolled': course.enrolled, 'card--full': course.credits >= 4 }"),
   * we delegate this logic to a TypeScript getter. This keeps our HTML clean, readable,
   * easier to maintain, and separates the presentation layer from the evaluation logic.
   */
  get cardClasses() {
    return {
      'card--enrolled': this.course.enrolled,
      'card--full': this.course.credits >= 4,
      'expanded': this.isExpanded
    };
  }
}
