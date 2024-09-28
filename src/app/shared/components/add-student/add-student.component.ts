import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service'; // Adjusted path to service
import { Student } from '../../../models/student'; // Adjusted path to model

@Component({
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent {
  studentForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  submitted: boolean = false; // Track if the form has been submitted

  constructor(private studentService: StudentService, private router: Router, private fb: FormBuilder) {
    // Initialize the form with validation
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      // Add other fields as needed
    });
  }

 // Method to add a new student
addStudent(): void {
  this.submitted = true; // Set submitted to true when the form is submitted
  if (this.studentForm.valid) {
    const student: Student = this.studentForm.value;
    
    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      this.errorMessage = 'Unauthorized access. Please log in.';
      return; // Exit if token is not present
    }

    // Pass both student and token to the createStudent method
    this.studentService.createStudent(student, token).subscribe(
      (response) => {
        this.successMessage = 'Student added successfully';
        this.errorMessage = '';
        this.router.navigate(['/students']);
      },
      (error) => {
        this.errorMessage = 'Error adding student';
        this.successMessage = '';
        console.error('Add failed', error);
      }
    );
  } else {
    this.errorMessage = 'Please fill in the form correctly.';
  }
}

}
