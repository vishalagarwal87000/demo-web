import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AppComponent } from '../../app.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  tickets: any[];
  cols: any[];
  newTicketModal: boolean = false;
  personName1: string;
  personName2: string;
  personName3: string;
  personName4: string;
  personName5: string;
  category: string;
  totalTickets: number;
  noOfPerson: number;
  message1: string;
  message2: string;
  header: string;
  disableInput: boolean;

  constructor(private globalService: GlobalService, private appComponent: AppComponent, private messageService: MessageService) { }

  ngOnInit(): void {
    this.disableInput = false;
    this.appComponent.showSpinner();
    this.globalService.getTickets().subscribe((res: any) => {
      if (res != undefined && res != null) {
        this.tickets = res;
        this.totalTickets = this.tickets.length;
        this.cols = [
          { field: 'id', header: 'ID' },
          { field: 'amount', header: 'AMOUNT' },
          { field: 'category', header: 'CATEGORY' }
        ];
        this.appComponent.hideSpinner();
      } else {
        this.appComponent.hideSpinner();
      }
    })
  }

  newTicketDialog() {
    this.newTicketModal = true;
    this.header = "NEW TICKET";
  }

  addTicket() {
    this.appComponent.showSpinner();
    let newTicketDetails: any = {};
    newTicketDetails.personName1 = this.personName1;
    newTicketDetails.personName2 = this.personName2;
    newTicketDetails.personName3 = this.personName3;
    newTicketDetails.personName4 = this.personName4;
    newTicketDetails.personName5 = this.personName5;
    newTicketDetails.totalTickets = this.totalTickets;
    newTicketDetails.category = this.category;
    newTicketDetails.noOfPerson = this.noOfPerson;

    this.globalService.addTicket(newTicketDetails).subscribe((res: any) => {
      if (res != undefined && res != null) {
        this.tickets = res;
        this.totalTickets = this.tickets.length;
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
    this.personName1 = "";
    this.personName2 = "";
    this.personName3 = "";
    this.personName4 = "";
    this.personName5 = "";
    this.category = "";
    this.noOfPerson = null;
    this.header = "";
    this.newTicketModal = false;
    this.disableInput = false;
    this.messageService.clear();
  }

  ticketDetails(data) {
    this.appComponent.showSpinner();
    console.log(data);
    this.header = "Tickets Summary";
    this.newTicketModal = true;
    this.disableInput = true;

    this.globalService.getTicketDetails(data).subscribe((res: any) => {
      if (res != undefined && res != null) {
        this.personName1 = res.personName1;
        this.personName2 = res.personName2;
        this.personName3 = res.personName3;
        this.personName4 = res.personName4;
        this.personName5 = res.personName5;
        this.category = res.category;
        this.noOfPerson = res.noOfPerson;
        this.appComponent.hideSpinner();
      } else {
        this.appComponent.hideSpinner();
      }
    })
  }

}
