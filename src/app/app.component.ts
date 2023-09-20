import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  showToast = false;
  message = '';
  statusCode = '';

  constructor(private toastService: ToastService) { 
    this.toastService.toastState.subscribe((toast) => {
      this.showToast = toast.show;
      this.message = toast.message;
      this.statusCode = toast.statusCode;
    });
  }

  closeToast() {
    this.toastService.hideToast();
  }
  
}
