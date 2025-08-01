import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Auth } from '../../../services/auth/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinner,Toast,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  isLoading = false;
  private authService = inject(Auth);
  private router = inject(Router);
  loginForm :FormGroup=new FormGroup(
    {
      email:new FormControl(null,[Validators.required,Validators.email]),
      password:new FormControl(null,[Validators.required])
    }
  )
  constructor(private messageService: MessageService,private route:ActivatedRoute) {
  }
  ngOnInit() {
  const sessionExpired = this.route.snapshot.queryParamMap.get('sessionExpired');
  if (sessionExpired) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Your session has expired. Please log in again.',
    });
  }
}
  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    const loginData = this.loginForm.value;
    this.isLoading=true;
    this.authService.loginRequest(loginData).subscribe({
      next: response =>{
          this.authService.saveToken(response.data!.token);
          this.router.navigate(['/home'], { queryParams: { login: 'true' } });
          this.isLoading=false;
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error.message,
        });
        }, 100);
        
        this.isLoading=false;
      }
    });
    this.loginForm.reset();


  }


}
