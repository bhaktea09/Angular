import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { HttpErrorResponse } from '@angular/common/http'; // Import for typing the error

@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css']
})
export class DeleteStudentComponent implements OnInit {
  deleteStudentForm: FormGroup; // Reactive form group
  message: string = ''; // Variable to hold success/error messages

  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router) {
    // Initialize the form group with validation
    this.deleteStudentForm = this.fb.group({
      studentId: [null, [Validators.required, Validators.min(1)]], // Add validations here
    });
  }

  ngOnInit(): void {}

  // Method to delete a student by ID
  deleteStudent(): void {
    if (this.deleteStudentForm.valid) {
      const studentId = this.deleteStudentForm.get('studentId')?.value;
      const token = localStorage.getItem('token'); // Retrieve the token

      if (!token) {
        this.message = 'Unauthorized access. Please log in.';
        return;
      }

      this.studentService.deleteStudent(studentId, token).subscribe(
        (response: any) => {
          this.message = 'Student deleted successfully!'; // Success message
          // Redirect to the student list after successful deletion
          setTimeout(() => this.router.navigate(['/students']), 2000);
        },
        (error: HttpErrorResponse) => { // Explicitly type the error parameter
          this.message = 'Error deleting student. Please try again.'; // Error handling
          console.error('Delete failed', error);
        }
      );
    } else {
      this.message = 'Please enter a valid student ID.'; // Validation error message
    }
  }
}
