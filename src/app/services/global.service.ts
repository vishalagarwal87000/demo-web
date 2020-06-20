import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  checkUserAccess() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log(userDetails)
    if (userDetails != null) {
      return true;
    } else {
      return false;
    }
  }

  getExportData() {
    var url: string = environment.appUrl + "getExportData";
    return this.http.get(url);
  }

  getTickets(data) {
    var url: string = environment.appUrl + "getTicket";
    return this.http.post(url, data);
  }

  addTicket(newTicketDetails) {
    var url: string = environment.appUrl + "addTicket";
    return this.http.post(url, newTicketDetails);
  }

  getTicketDetails(data) {
    var url: string = environment.appUrl + "getTicketDetails";
    return this.http.post(url, data);
  }
  
}
