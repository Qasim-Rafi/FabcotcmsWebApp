import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  response: any;
  buyer: any = [];
  article: any = [];
  listCount: number;
  data: any = [];

  constructor(private http: HttpClient,
    private toastr: ToastrService,) { }

  getCountry() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
  }

  getBuyers() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`);
  }
  getArticles() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Articles`)
  }
  getPaymentTerm() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PaymentTerms`)
  }
  getPackaging() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Packagings`)
  }

  getDesignType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/DesignTypes`)
  }
  getProcess() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Process`)
  }
  getProcessType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/ProcessTypes`)
  }
  getCertification() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Certifications`)

  }
  getPriceTerm() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PriceTerms`)

  }
  getCity() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Destinations`)
  }
  getUOM() {
    return this.http.get(`${environment.apiUrl}/api/Enquiries/GetAllUOM`)
  }
 
  login(loginData){
    return this.http.get(`${environment.apiUrl}/api/Auth/Login`)
  }

//  -------------Fetch function for all components --------------------------------//

  fetch(cb , apiUrl2) {
    let desc = this;
    desc.http
      .get(`${environment.apiUrl}`+ apiUrl2)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.listCount = this.response.data.length;

          desc.data = this.response.data;
          cb(this.data);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
      });
  }
  
  // excel
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
 

}
function cb(data: any) {
  throw new Error('Function not implemented.');
}

