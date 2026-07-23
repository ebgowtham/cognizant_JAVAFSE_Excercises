import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-enrollment-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.css'
})
export class EnrollmentFormComponent {
  studentName = '';
  studentEmail = '';
  courseId: number | null = null;
  preferredSemester = '';
  agreeToTerms = false;
  
  submitted = false;

  constructor(private courseService: CourseService) {}

  onSubmit(form: NgForm): void {
    console.log('Form Value:', form.value);
    console.log('Form Valid:', form.valid);
    if (form.valid) {
      // Construct a course object using form values
      const newCourseObj = {
        name: `Course for Student ${form.value.studentName}`,
        code: `STU${form.value.courseId || 999}`,
        credits: 3,
        gradeStatus: 'pending' as const
      };

      this.courseService.createCourse(newCourseObj).subscribe({
        next: (res) => {
          console.log('Created course via enrollment form:', res);
          this.submitted = true;
        },
        error: (err) => console.error('Error creating course:', err)
      });
    }
  }

  onReset(form: NgForm): void {
    form.resetForm();
    this.submitted = false;
  }
}
