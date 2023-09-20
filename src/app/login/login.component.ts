import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
import { ToastService } from '../toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  data: any;
  form: FormGroup = new FormGroup({});

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.dataService.login(formData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
              this.toastService.showToast(error.error.message, error.status.toString());
              return throwError(error);
          }
      ))
      .subscribe((data: any) => {
        this.data = data;
        const token = this.data.acess_token;
        localStorage.setItem('token', token);
        this.userService.updateUserState(data.user);
        this.router.navigate(['/tasks']);
      });
    }
  }
  
}
