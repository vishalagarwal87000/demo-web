import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { UploadService } from '../../services/upload.service';
import { AppComponent } from '../../app.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';

export interface Ticket {
  id: string;
  amount: number;
  category: number;
}

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number;
  pageIndex: number;
  pageSize: number;

  displayedColumns: string[] = ['id', 'amount', 'category'];
  // cols: any[] = [{field: 'id', header: 'ID'},{field: 'amount', header: 'Amount'},{field: 'category', header: 'Category'}];
  tickets: Ticket[];
  exportData: any;
  dataSource: any;

  newTicketModal: boolean = false;
  personName1: string;
  personName2: string;
  personName3: string;
  personName4: string;
  personName5: string;
  category: string;
  noOfPerson: number;
  message1: string;
  message2: string;
  header: string;
  disableInput: boolean;
  loginPage: any[] = ['login'];
  pageSizeOptions: number[] = [];

  fileExtension = '.xlsx';
  list: any = ['"TATKAL,Normal"'];
  templateHeader: any = ["Id", "Amount", "Category"];
  fileStatus: boolean;
  selectedFile: File;

  constructor(private router: Router, private uploadService: UploadService, private globalService: GlobalService, private appComponent: AppComponent, private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.globalService.checkUserAccess()) {
      this.appComponent.showSpinner();
      this.disableInput = false;
      let ticketRequest: any = {};
      this.pageIndex = ticketRequest.pageIndex = 0;
      this.pageSize = ticketRequest.pageSize = 5;
      this.getTicket(ticketRequest);
    } else {
      this.router.navigate(this.loginPage);
    }
  }

  getTicket(ticketRequest) {
    this.globalService.getTickets(ticketRequest).subscribe((res: any) => {
      if (res != undefined && res.ticket != null) {
        this.tickets = res.ticket;
        this.length = res.length;
        this.setPageSizeOptions(this.length);
        this.dataSource = new MatTableDataSource<Ticket>(this.tickets);
        this.appComponent.hideSpinner();
      } else {
        this.appComponent.hideSpinner();
      }
    })
  }

  setPageSizeOptions(length) {
    this.pageSizeOptions = [];
    if (length > 0) {
      for (let i = 5; i <= length; i += 5) {
        this.pageSizeOptions.push(i);
      }
      this.paginator.pageSizeOptions = this.pageSizeOptions;
    }
  }

  getDataOnNext(event) {
    this.appComponent.showSpinner();
    let ticketRequest: any = {};
    this.pageIndex = ticketRequest.pageIndex = event.pageIndex;
    this.pageSize = ticketRequest.pageSize = event.pageSize;
    this.getTicket(ticketRequest);
  }

  exportExcel() {
    this.appComponent.showSpinner();
    this.globalService.getExportData().subscribe((res: any) => {
      if (res != undefined && res != null) {
        this.exportData = res;
        const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportData);
        const workBook: XLSX.WorkBook = { Sheets: { 'data': workSheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "TicketData");
        this.appComponent.hideSpinner();
      } else {
        this.appComponent.hideSpinner();
      }
    })
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: "text/xlsx;charset=utf-8" });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  downloadTemplate() {
    this.appComponent.showSpinner();
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('data');
    worksheet.addRow(this.templateHeader);
    for (let index = 2; index <= 250; index++) {
      let cell = 'C' + index;
      worksheet.getCell(cell).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: this.list,
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Error",
        error: "Value must be from the list"
      }
    }
    workbook.xlsx.writeBuffer().then((data) => {
      this.saveAsExcelFile(data, "TicketTemplate");
      this.appComponent.hideSpinner();
    });
  }

  uploadExcel(event) {
    this.appComponent.showSpinner();
    if (event.target.files.length > 0) {
      this.selectedFile = event.currentTarget.files[0];
      this.fileStatus = this.uploadService.fileChangeListener(event);
    } else {
      this.fileStatus = false;
    }
    if (this.fileStatus && this.selectedFile != null) {
      this.uploadService.uploadExcel(this.selectedFile).subscribe((res: any) => {
        if (res != undefined && res != null) {
          console.log(res);
          this.appComponent.hideSpinner();
          alert("file upload successfully ");
        } else {
          this.appComponent.hideSpinner();
          alert("error while uploading fie details");
        }
      })

    } else {
      this.appComponent.hideSpinner();
      alert('Select a valid xlsx File');
    }
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
    newTicketDetails.category = this.category;
    newTicketDetails.noOfPerson = this.noOfPerson;
    newTicketDetails.pageSize = this.pageSize;
    newTicketDetails.pageIndex = this.pageIndex;

    this.globalService.addTicket(newTicketDetails).subscribe((res: any) => {
      if (res != undefined && res.ticket != null) {
        this.tickets = res.ticket;
        this.length = res.length;
        this.dataSource = new MatTableDataSource<Ticket>(this.tickets);
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