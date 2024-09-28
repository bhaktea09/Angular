import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service'; // Adjusted path to service
import { Student } from '../../../models/student'; // Adjusted path to model

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  studentForm: FormGroup;
  isEditMode = false; // Flag to track if we are editing
  errorMessage: string = ''; // Error message to display
  successMessage: string = ''; // Success message to display

  constructor(private studentService: StudentService, private fb: FormBuilder) {
    // Initialize the form with validation rules
    this.studentForm = this.fb.group({
      id: [''], // Hidden field for the student ID
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.studentService.getAllStudents().subscribe(
      (data: Student[]) => {
        this.students = data;
      },
      (error: any) => {
        this.errorMessage = 'Error fetching student data'; // Error handling
        console.error('Fetch failed', error);
      }
    );
  }

  editStudent(student: Student): void {
    // Populate the form with the student data for editing
    this.studentForm.patchValue(student);
    this.isEditMode = true; // Set edit mode to true
    this.errorMessage = ''; // Clear any previous error messages
  }
  
  deleteStudent(id: number): void {
    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      this.errorMessage = 'Unauthorized access. Please log in.';
      return;
    }

    this.studentService.deleteStudent(id, token).subscribe(
      (response: any) => {
        this.fetchStudents(); // Refresh the student list after deletion
        this.successMessage = 'Student deleted successfully'; // Success message
      },
      (error: any) => {
        this.errorMessage = 'Error deleting student'; // Error handling
        console.error('Delete failed', error);
      }
    );
  }

  onSubmit(): void {
    // Check if the form is valid
    if (this.studentForm.invalid) {
      return;
    }
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token'); 
    if (!token) {
      this.errorMessage = 'Unauthorized access. Please log in.';
      return; // Exit if token is not present
    }
  
    // Get the student data from the form
    const studentData = this.studentForm.value;
  
    // Call the service method to update the student
    this.studentService.updateStudent(studentData.id, studentData, token).subscribe(
      (response: Student) => {
        this.successMessage = 'Student updated successfully';
        this.fetchStudents(); // Refresh the student list
        this.isEditMode = false; // Exit edit mode
        this.studentForm.reset(); // Reset the form
      },
      (error: any) => {
        this.errorMessage = 'Error updating student'; // Handle error
        console.error('Update failed', error);
        
        // Detailed error handling based on status
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized: You need to log in again.';
        } else if (error.status === 404) {
          this.errorMessage = 'Student not found.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
  

  resetForm(): void {
    this.studentForm.reset();
    this.isEditMode = false; // Reset edit mode
    this.errorMessage = ''; // Clear error messages
    this.successMessage = ''; // Clear success messages
  }
}
