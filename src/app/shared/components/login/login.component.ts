import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust if necessary

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  invalidLogin = false;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // private accountService: AccountService,
  ) // private alertService: AlertService
  {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }
  
    this.loading = true;
    this.authService.login({
      usernameOrEmail: this.form.value.username,
      password: this.form.value.password
    }).subscribe({
      next: (response) => {
        if (response && response.accessToken) {
          localStorage.setItem('token', response.accessToken); // Store the token
          this.router.navigate(['/home']); // Navigate after successful login
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loading = false;
        this.invalidLogin = true;
      }
    });
  }
}
  
    // this.form.markAsPristine();
    // this.form.markAsUntouched();
    // this.form.valid;

    // this.loading = true;
    // this.accountService.login(this.f['username'].value, this.f['password'].value)
    //     .pipe(first())
    //     .subscribe({
    //         next: () => {
    //             // get return url from query parameters or default to home page
    //             const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //             this.router.navigateByUrl(returnUrl);
    //         },
    //         error: error => {
    //             this.alertService.error(error);
    //             this.loading = false;
    //         }
    //     });
  
