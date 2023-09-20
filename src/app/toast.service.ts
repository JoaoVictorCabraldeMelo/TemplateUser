import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Toast {
  show: boolean;
  message: string;
  statusCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  public toastState: BehaviorSubject<Toast> = new BehaviorSubject<Toast>({ show: false, message: '', statusCode: '' });

  constructor() { }
  
  showToast(message: string, statusCode: string) {
    this.toastState.next({ show: true, message, statusCode });
  }

  hideToast() {
    this.toastState.next({ show: false, message: '', statusCode: '' });
  }


}
