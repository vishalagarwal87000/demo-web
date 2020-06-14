import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  getTickets() {
    var url: string = environment.appUrl + "getTicket";
    return this.http.get(url);
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
