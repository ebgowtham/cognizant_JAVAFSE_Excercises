import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { HighlightDirective } from '../../directives/highlight.directive';

export interface Course {
  id: number;
  title: string;
  gradeStatus: 'passed' | 'failed' | 'pending';
  enrolled: boolean;
  credits: number;
}

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseCardComponent, HighlightDirective],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit, OnDestroy {
  isLoading = true;
  courses: Course[] = [
    { id: 1, title: 'Angular Basics', gradeStatus: 'passed', enrolled: true, credits: 4 },
    { id: 2, title: 'TypeScript Essentials', gradeStatus: 'pending', enrolled: false, credits: 3 },
    { id: 3, title: 'RxJS Deep Dive', gradeStatus: 'failed', enrolled: false, credits: 5 },
    { id: 4, title: 'Intro to Programming', gradeStatus: 'passed', enrolled: true, credits: 1 },
    { id: 5, title: 'Independent Study', gradeStatus: 'pending', enrolled: false, credits: null as any }
  ];
  selectedCourseMessage: string = '';

  ngOnInit(): void {
    console.log('CourseListComponent initialized (ngOnInit)');
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  ngOnDestroy(): void {
    console.log('CourseListComponent destroyed (ngOnDestroy)');
  }

  onCourseSelected(courseTitle: string): void {
    this.selectedCourseMessage = 'You selected: ' + courseTitle;
  }

  /*
   * WHY trackBy IMPROVES PERFORMANCE:
   * By default, *ngFor tracks items by their object reference. If the array data is reloaded,
   * even if the items are identical, Angular destroys and recreates the entire DOM subtree
   * for the list. With trackBy, we supply a unique identifier (like course.id).
   * Angular can then track which items were added, removed, or reordered, and only update
   * the changed DOM elements, resulting in a much faster rendering process.
   */
  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }
}
