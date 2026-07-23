import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

  onSubmit(form: NgForm) {
    console.log('Form Values:', form.value);
    console.log('Form Validity:', form.valid);
    if (form.valid) {
      this.submitted = true;
    }
  }

  onReset(form: NgForm) {
    form.resetForm();
    this.submitted = false;
  }
}
