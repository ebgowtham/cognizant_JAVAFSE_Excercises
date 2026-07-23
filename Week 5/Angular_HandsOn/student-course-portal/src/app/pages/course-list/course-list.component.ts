import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';

// NgRx imports
import { Store } from '@ngrx/store';
import { loadCourses } from '../../store/course/course.actions';
import { selectAllCourses, selectCoursesLoading, selectCoursesError } from '../../store/course/course.selectors';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseCardComponent, FormsModule, HighlightDirective],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  isLoading = true;
  selectedCourseId: number | null = null;
  searchTerm = '';
  errorMessage = '';

  courses$: Observable<Course[]>;
  filteredCourses$: Observable<Course[]>;
  private searchSubject = new BehaviorSubject<string>('');

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.courses$ = this.store.select(selectAllCourses);
    
    // Combine store courses with local search filter reactive stream
    this.filteredCourses$ = combineLatest([this.courses$, this.searchSubject.asObservable()]).pipe(
      map(([courses, term]) => {
        if (!term.trim()) {
          return courses;
        }
        const lowerTerm = term.toLowerCase();
        return courses.filter(c => 
          c.name.toLowerCase().includes(lowerTerm) || 
          c.code.toLowerCase().includes(lowerTerm)
        );
      })
    );
  }

  ngOnInit(): void {
    // Read query parameter from route snapshot
    const searchVal = this.route.snapshot.queryParamMap.get('search');
    if (searchVal) {
      this.searchTerm = searchVal;
      this.searchSubject.next(searchVal);
    }

    // Dispatch loadCourses action to trigger NgRx Effect
    this.store.dispatch(loadCourses());

    // Sync loading state and error messages from NgRx state
    this.store.select(selectCoursesLoading).subscribe(loading => this.isLoading = loading);
    this.store.select(selectCoursesError).subscribe(err => this.errorMessage = err || '');
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
    // Update the URL with search query parameter
    this.router.navigate(['courses'], { queryParams: { search: this.searchTerm } });
  }

  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }

  onEnroll(courseId: number): void {
    console.log('Enrolling in course: ' + courseId);
    this.selectedCourseId = courseId;
  }

  isEnrolled(courseId: number): boolean {
    return this.enrollmentService.isEnrolled(courseId);
  }
}
