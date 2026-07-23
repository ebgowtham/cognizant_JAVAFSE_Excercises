import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CourseService } from '../../services/course.service';

// Custom Synchronous Validator
export function noCourseCode(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (val && typeof val === 'string' && val.toUpperCase().startsWith('XX')) {
    return { noCourseCode: true };
  }
  if (val && typeof val === 'number' && String(val).toUpperCase().startsWith('XX')) {
    return { noCourseCode: true };
  }
  return null;
}

// Custom Async Validator
export function simulateEmailCheck(control: AbstractControl): Promise<ValidationErrors | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const email = control.value;
      if (email && typeof email === 'string' && email.toLowerCase().includes('test@')) {
        resolve({ emailTaken: true });
      } else {
        resolve(null);
      }
    }, 800);
  });
}

@Component({
  selector: 'app-reactive-enrollment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.component.html',
  styleUrl: './reactive-enrollment-form.component.css'
})
export class ReactiveEnrollmentFormComponent implements OnInit {
  enrollForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Build form group
    this.enrollForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentEmail: this.fb.control('', [Validators.required, Validators.email], [simulateEmailCheck]),
      courseId: [null, [Validators.required, noCourseCode]],
      preferredSemester: ['Odd', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      additionalCourses: this.fb.array([])
    });
  }

  /*
   * WHY TYPED GETTERS ARE BETTER THAN CASTING IN THE TEMPLATE:
   * 1. Strong Typing & Intellisense: By returning `FormArray` from the getter, TypeScript provides type safety
   *    and autocompletion within the class.
   * 2. Cleaner Templates: Templates should focus on layout and bindings. Writing `as FormArray` or casting inside
   *    the template is verbose, error-prone, and breaks separation of concerns.
   * 3. Testability: The getter can be easily unit tested in isolation.
   */
  get additionalCourses(): FormArray {
    return this.enrollForm.get('additionalCourses') as FormArray;
  }

  addCourse(): void {
    this.additionalCourses.push(this.fb.control('', Validators.required));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  /*
   * DIFFERENCE BETWEEN enrollForm.value AND enrollForm.getRawValue():
   * - enrollForm.value returns an object containing only the values of the ENABLED controls in the group.
   *   If any control in the form is disabled (e.g. courseId is disabled dynamically), its value is omitted.
   * - enrollForm.getRawValue() returns the values of ALL controls in the form group,
   *   regardless of whether they are enabled or disabled.
   */
  onSubmit(): void {
    console.log('enrollForm.value:', this.enrollForm.value);
    console.log('enrollForm.getRawValue():', this.enrollForm.getRawValue());
    console.log('Form Validity:', this.enrollForm.valid);
    
    if (this.enrollForm.valid) {
      const newCourseObj = {
        name: `Course for Student ${this.enrollForm.value.studentName}`,
        code: `STU${this.enrollForm.value.courseId || 999}`,
        credits: 3,
        gradeStatus: 'pending' as const
      };

      this.courseService.createCourse(newCourseObj).subscribe({
        next: (res) => {
          console.log('Created course via reactive form:', res);
          this.submitted = true;
        },
        error: (err) => console.error('Error creating course:', err)
      });
    }
  }

  onReset(): void {
    this.enrollForm.reset({
      preferredSemester: 'Odd',
      agreeToTerms: false
    });
    this.additionalCourses.clear();
    this.submitted = false;
  }
}
