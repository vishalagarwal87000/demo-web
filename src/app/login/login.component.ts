import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AdminService } from '../services/admin.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  username: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: any[];
  roleSelected: string;
  userNotFound: boolean;
  dashboard: any[] = ['dashboard'];
  log: any[] = ['login'];
  newUserModal: boolean = false;
  message1: string;
  message2: string;
  userDetails: any;

  constructor(private router: Router, private appComponent: AppComponent, private adminService: AdminService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
    this.userNotFound = false;
  }

  login() {
    this.appComponent.showSpinner();
    this.username = this.form.value.username;
    this.password = this.form.value.password;
    this.adminService.getUserDetails(this.username).subscribe((res: any) => {
      if (res != null && res != undefined) {
        this.userDetails = res;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.router.navigate(this.dashboard);
        this.appComponent.hideSpinner();
      } else {
        this.userNotFound = true;
        this.userDetails = null;
        this.router.navigate(this.log);
        this.appComponent.hideSpinner();
      }
    })

  }

  newUserRoles() {
    this.appComponent.showSpinner();
    this.adminService.getRoles().subscribe((res: any) => {
      if (res != undefined && res != null) {
        this.role = res;
        this.newUserModal = true;
        this.appComponent.hideSpinner();
      } else {
        this.newUserModal = false;
        this.appComponent.hideSpinner();
      }
    })

  }

  newUserDetails() {
    this.appComponent.showSpinner();
    let userDetails: any = {};
    userDetails.firstName = this.firstName;
    userDetails.lastName = this.lastName;
    userDetails.userName = this.userName;
    userDetails.role = this.roleSelected;

    this.adminService.newUserDetails(userDetails).subscribe((res: any) => {
      if (res != undefined && res != null && res == 1) {
        this.message1 = "Success";
        this.message2 = "Data Saved Successfully!";
        this.appComponent.hideSpinner();
        this.messageService.add({ key: 'c', severity: 'success', summary: 'Summary Text', detail: 'Detail Text' });
      } else {
        this.message1 = "Failure";
        this.message2 = "Data didn't Saved Successfully!";
        this.appComponent.hideSpinner();
        this.messageService.add({ key: 'e', severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
      }
    })
  }

  onReject() {
    this.message1 = "";
    this.message2 = "";
    this.newUserModal = false;
    this.messageService.clear();
  }

}
