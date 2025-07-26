import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinner,CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  errorMessage: string = '';
  isLoading = false;
  private authService = inject(Auth);
  signupForm : FormGroup = new FormGroup(
    {
      name : new FormControl(null,[Validators.required,Validators.minLength(3)]),
      email: new FormControl(null,[Validators.required,Validators.email]),
      password : new FormControl(null,[Validators.required,Validators.minLength(6)]),
      phoneNumber : new FormControl(null,[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)])
    }
  )

  onSubmit(){
    if (!this.signupForm.valid) {
      return;
    }
    const registerData = this.signupForm.value;
    this.isLoading=true;
    this.authService.registerRequest(registerData).subscribe({
      next: response =>{
        this.authService.saveToken(response.data!.token);
        console.log('User Registered Name: ',response.data!.name);
        console.log('User Registered Token: ',response.data!.token);
        this.isLoading=false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Something went wrong';
        this.isLoading=false;
      }
    })
    this.signupForm.reset();
  }
  getControlError(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['email']) return 'Invalid email address.';
    if (control.errors['pattern'] && controlName === 'phoneNumber') return 'Invalid Egyptian phone number.';
    return '';
  }
}
