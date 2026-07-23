import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Course } from '../../models/course.model';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  enrolledStudents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    /*
     * WHY switchMap CANCELS PREVIOUS INNER OBSERVABLES:
     * `switchMap` is a flattening operator. When a new value arrives from the source Observable
     * (e.g. a new course id parameter due to route navigation), `switchMap` immediately
     * unsubscribes from (cancels) the previous inner Observable (the pending HTTP request for students)
     * and maps to a new inner Observable. This guarantees that only the results of the latest request
     * are processed, preventing race conditions where out-of-order network responses overwrite newer state.
     */
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => {
        // Chain the course details fetch and then get the students for that course
        return this.courseService.getCourseById(id).pipe(
          tap(c => this.course = c),
          switchMap(() => this.enrollmentService.getStudentsByCourse(id))
        );
      })
    ).subscribe({
      next: (students) => {
        this.enrolledStudents = students;
        console.log('Enrolled students loaded via switchMap:', students);
      },
      error: (err) => {
        console.error('Error loading course or students:', err);
      }
    });
  }
}
