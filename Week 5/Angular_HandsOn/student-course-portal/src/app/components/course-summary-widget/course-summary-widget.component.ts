import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Store } from '@ngrx/store';
import { selectAllCourses } from '../../store/course/course.selectors';
import { loadCourses } from '../../store/course/course.actions';

@Component({
  selector: 'app-course-summary-widget',
  imports: [CommonModule],
  templateUrl: './course-summary-widget.component.html',
  styleUrl: './course-summary-widget.component.css'
})
export class CourseSummaryWidgetComponent implements OnInit {
  coursesCount = 0;

  constructor(
    private courseService: CourseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Subscribe to store selector to keep count in sync
    this.store.select(selectAllCourses).subscribe(c => this.coursesCount = c.length);
  }

  addNewCourse(): void {
    const nextId = 100 + this.coursesCount + 1;
    const newCourse: Omit<Course, 'id'> = {
      name: `New Dynamic Course ${nextId}`,
      code: `CS${nextId}`,
      credits: 3,
      gradeStatus: 'pending'
    };
    
    // Call service to post new course and dispatch action to reload store
    this.courseService.createCourse(newCourse).subscribe({
      next: (res) => {
        console.log('Created course via shared service:', res);
        this.store.dispatch(loadCourses());
      },
      error: (err) => console.error('Error adding course:', err)
    });
  }
}
