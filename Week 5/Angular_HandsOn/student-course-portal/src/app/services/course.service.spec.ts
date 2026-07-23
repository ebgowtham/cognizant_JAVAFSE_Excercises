import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses: Course[] = [
    { id: 101, name: 'Angular Course', code: 'CS101', credits: 3, gradeStatus: 'passed' },
    { id: 102, name: 'TypeScript Course', code: 'CS102', credits: 4, gradeStatus: 'pending' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asserts no outstanding HTTP requests were made
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch course list and filter credits > 0 (getCourses)', () => {
    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(2);
      expect(courses[0].name).toBe('Angular Course');
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should handle error when fetching courses fails', () => {
    service.getCourses().subscribe({
      next: () => fail('Expected error, but got courses list'),
      error: (error) => {
        expect(error.message).toBe('Failed to load courses. Please try again.');
      }
    });

    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('http://localhost:3000/courses');
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    }
  });
});
