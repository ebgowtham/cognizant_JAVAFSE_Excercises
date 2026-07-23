import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, retry } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  /*
   * WHY tap IS PREFERRED OVER SIDE EFFECTS INSIDE map:
   * `tap` is designed specifically for side-effect operations (logging, analytic tracking, updating local states)
   * that should not modify the stream's data.
   * `map` is intended purely for data transformations.
   * Using `tap` guarantees that side effects will not accidentally mutate the stream values,
   * keeping the operator pipeline clean and predictable.
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      retry(2), // Retry failed HTTP requests up to 2 times
      tap(courses => console.log('Courses loaded:', courses.length)),
      map(courses => courses.filter(c => c.credits !== null && c.credits > 0)), // filter credits > 0
      catchError(err => {
        console.error('HTTP error occurred:', err);
        return throwError(() => new Error('Failed to load courses. Please try again.'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`HTTP error fetching course ${id}:`, err);
        return throwError(() => new Error('Failed to load course details. Please try again.'));
      })
    );
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
