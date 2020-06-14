import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getUserDetails(username) {
    var url: string = environment.appUrl + "getUserDetails?username=" + username;
    return this.http.get(url);
  }

  getRoles(){
    var url: string = environment.appUrl + "getRoles";
    return this.http.get(url);
  }

  newUserDetails(userDetails){
    var url: string = environment.appUrl + "newUserDetails";
    return this.http.post(url, userDetails);
  }
}
