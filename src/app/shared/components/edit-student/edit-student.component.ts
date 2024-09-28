import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service'; // Adjusted path to service
import { Student } from '../../../models/student'; // Adjusted path to model

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  studentForm: FormGroup;
  id: number;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    public router: Router,  // Change 'private' to 'public'
    private formBuilder: FormBuilder
  ) {
    this.id = 0;
    this.studentForm = this.createForm(); // Initialize the reactive form
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Fetch student ID from URL
    this.getStudentById(this.id); // Load the student details for editing
  }

  // Create a reactive form with validations
  private createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Fetch the student details by ID
  getStudentById(id: number): void {
    this.studentService.getStudentById(id).subscribe(
      (data: Student) => {
        this.studentForm.patchValue(data); // Populate form fields with student data
      },
      (error) => {
        console.error('Error fetching student', error);
        this.errorMessage = 'Failed to fetch student details';
      }
    );
  }

  // Method to update the student's details
  updateStudent(): void {
    if (this.studentForm.valid) {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (!token) {
        this.errorMessage = 'Unauthorized access. Please log in.';
        return; // Exit if token is not present
      }

      // Prepare the student data
      const studentData: Student = { ...this.studentForm.value, id: this.id }; // Ensure this matches the Student interface
      console.log('Updating student with data:', studentData); // Log the data

      // Call the service method to update the student
      this.studentService.updateStudent(this.id, studentData, token).subscribe(
        (response: any) => {
          this.successMessage = 'Student updated successfully';
          this.router.navigate(['/students']); // Redirect after success
        },
        (error: any) => {
          console.error('Update failed', error); // Log the error response
          this.errorMessage = 'Failed to update student: ' + (error.error?.message || error.message); // Use optional chaining for safety
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly'; // Error handling for form validation
    }
  }
}
