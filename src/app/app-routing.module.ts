import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './shared/components/student-list/student-list.component';
import { AddStudentComponent } from './shared/components/add-student/add-student.component';
import { EditStudentComponent } from './shared/components/edit-student/edit-student.component';
import { DeleteStudentComponent } from './shared/components/delete-student/delete-student.component';
import { LoginComponent } from './shared/components/login/login.component';

const routes: Routes = [
  { path: 'students', component: StudentListComponent },                  
  { path: 'students/add', component: AddStudentComponent },               
  { path: 'students/update/:id', component: EditStudentComponent },        
  { path: 'students/delete/:id', component: DeleteStudentComponent },  
  { path: 'api/auth/login', component: LoginComponent } ,
   { path: '', redirectTo: '/students', pathMatch: 'full' },              
  { path: '**', redirectTo: '/students' }                                
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
