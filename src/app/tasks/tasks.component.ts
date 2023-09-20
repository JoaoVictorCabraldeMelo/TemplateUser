import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, catchError, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { DataService, Task } from '../data.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  userId: string = '';
  userSubscription = new Subscription();

  message: string = '';
  statusCode: string = '';
  showModal: boolean = false;

  tasks: Task[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dataService: DataService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [''],
      description: ['']
    });

    this.userSubscription = this.userService.current.subscribe(user => {
      console.log('user', user);
      if (user) {
        this.userId = user._id;
      }
    });

    this.fetchTasks();
  }

  onSubmit() {
    const formData = this.form.value;

    const taskData = {
      ...formData,
      userId: this.userId
    }

    this.dataService.createTask(taskData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showToast(error.error.message, error.status.toString());
          return throwError(error);
        })
      )
      .subscribe((res) => {
        this.tasks.push(res);
        this.form.reset();
        this.closeModal();
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  fetchTasks():void {
    if (this.userId) {
      this.dataService.getTasks(this.userId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.toastService.showToast(error.error.message, error.status.toString());
            return throwError(error);
          })
        )
        .subscribe((tasks) => {
          this.tasks = tasks;
        });
    }
      

  }

  logout() {
    localStorage.removeItem('token');
    this.userService.updateUserState(null);
    this.router.navigate(['/login']);
  }

  goToPokemon() {
    this.router.navigate(['/pokemon']);
  }

}
