import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  fileName: string = "";
  file: File;
  fileStatus: boolean;

  constructor(private http: HttpClient) { }

  fileChangeListener(event: any): boolean {
    let files = event.srcElement.files;
    if (files.length > 0) {
      this.setFile(files[0]);
    }
    if (this.isXLFile(files[0])) {
      let input = event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      this.fileName = files[0].name;
      this.fileStatus = true;
      return this.fileStatus;
    } else {
      this.fileStatus = false;
      return this.fileStatus;
    }
  }
  getFile() {
    return this.file;
  }

  setFile(file: File) {
    this.file = file;
  }

  // CHECK IF FILE IS A VALID XL FILE
  isXLFile(file: any) {
    return file.name.endsWith(".xlsx");
  }

  uploadExcel(file: File) {
    var url: string = environment.appUrl + "uploadExcel";
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post(url, formdata);
  }
}
