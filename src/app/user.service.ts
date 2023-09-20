import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userState = new BehaviorSubject<any>(null);
  current = this.userState.asObservable();

  constructor() { }

  updateUserState(user: any) {
    this.userState.next(user);
  }

  isUserAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
