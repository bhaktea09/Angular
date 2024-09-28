import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student'; 

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  deleteStudentById(studentId: any) {
    throw new Error('Method not implemented.');
  }
 
  private baseUrl = 'http://localhost:8080/api/students'; // Base URL for the REST API
  


  constructor(private http: HttpClient) {}

// student.service.ts
createStudent(student: Student, token: string): Observable<Student> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<Student>(`${this.baseUrl}`, student, { headers });
}


  getAllStudents(): Observable<Student[]> {
    const token = localStorage.getItem('token'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Student[]>(this.baseUrl, { headers });
  }

  // Get a student by ID
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  // Add a new student
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
updateStudent(id: number, student: Student, token: string): Observable<Student> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put<Student>(`${this.baseUrl}/${id}`, student, { headers });
}




  // Delete a student by ID
  deleteStudent(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
  
