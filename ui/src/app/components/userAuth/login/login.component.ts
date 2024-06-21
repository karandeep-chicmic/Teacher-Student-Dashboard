import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { user } from '../../../interfaces/user.interface';
import { ApiCallsService } from '../../../services/api-calls.service';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router: Router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid !!');
      return;
    }

    const userToLogin: user = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

    this.apiCalls.loginUser(userToLogin).subscribe({
      next: (data: any) => {
        localStorage.setItem('role', data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        if (data.role === 'admin') {
          this.router.navigate([ROUTES_UI.ADMIN_PANEL]);
        } else {
          this.router.navigate([ROUTES_UI.MARKS_DASHBOARD]);
        }
      },
      error: (err) => {
        console.log('ERROR IS :', err);
        this.sweetAlert.error(err.error);
      },
    });
  }
}
