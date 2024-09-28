import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // Ensure this is imported
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule if needed
import { AppComponent } from './app.component';
import { JwtHelperService , JWT_OPTIONS } from '@auth0/angular-jwt';
import { AddStudentComponent } from './shared/components/add-student/add-student.component';
import { DeleteStudentComponent } from './shared/components/delete-student/delete-student.component';
import { EditStudentComponent } from './shared/components/edit-student/edit-student.component';
import { LoginComponent } from './shared/components/login/login.component';
import { StudentListComponent } from './shared/components/student-list/student-list.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    DeleteStudentComponent,
    EditStudentComponent,
    LoginComponent,
    StudentListComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add this
    ReactiveFormsModule // Add this if you're using Reactive Forms
  ],
  providers: [
    provideHttpClient(),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, 
    JwtHelperService 
  ], // Add any global services here
  bootstrap: [AppComponent]
})
export class AppModule { }
