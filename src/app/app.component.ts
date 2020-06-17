import { Component, OnInit, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo-web';

  constructor(private spinner: NgxSpinnerService, private router: Router) { }

  @HostListener("window:load", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnInit() {

  }
}
