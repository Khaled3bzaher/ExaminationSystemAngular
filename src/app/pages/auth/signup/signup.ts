import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinner,
    CommonModule,
    Toast,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  isLoading = false;
  private authService = inject(Auth);
  private messageService = inject(MessageService);
  private router = inject(Router);
  signupForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern(/^[\p{L} ]+$/u),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/\d/),
      Validators.pattern(/[@$!%*?&]/),
    ]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
  });

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const registerData = this.signupForm.value;
    this.isLoading = true;
    this.authService.registerRequest(registerData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.data!.token);
        this.router.navigate(['/home'], { queryParams: { login: 'true' } });
        this.isLoading = false;
        this.signupForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
  getControlError(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters.`;
    }
    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${requiredLength} characters.`;
    }
    if (control.errors['email']) return 'Invalid email address.';

    if (control.errors['pattern']) {
      if (controlName === 'name') {
        return 'Name must contain only letters (Arabic or English) and spaces.';
      }
      if (controlName === 'phoneNumber') {
        return 'Phone number must be a valid Egyptian number.';
      }
      if (controlName === 'password') {
        const value: string = control.value ?? '';
        if (!/[A-Z]/.test(value))
          return 'Password must contain at least one uppercase letter.';
        if (!/[a-z]/.test(value))
          return 'Password must contain at least one lowercase letter.';
        if (!/\d/.test(value))
          return 'Password must contain at least one number.';
        if (!/[@$!%*?&]/.test(value))
          return 'Password must contain at least one special character.';
        return 'Password does not meet the required format.';
      }
    }

    return '';
  }
}
