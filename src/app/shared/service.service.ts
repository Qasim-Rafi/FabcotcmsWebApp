import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const CSV_TYPE = 'application/json;charset=utf-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  response: any;
  buyer: any = [];
  article: any = [];
  listCount: number;
  data: any = [];
  rootUrl: "/api/Auth/Login";

  constructor(private http: HttpClient,
    private toastr: ToastrService,) { }

    userAuthentication(username, password) {
        var data = "username=" + username + "&password=" + password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
        return this.http.post('/api/Auth/Login' + '/token', data, { headers: reqHeader });
      }

//file upload service starts here


      upload(formData) {
        return this.http.post<any>(`${environment.apiUrl}/api/Lookups/Countries`, formData, {
          reportProgress: true,
          observe: 'events'
        }).pipe(
          map(event => this.getEventMessage(event, formData)),
          catchError(this.handleError)
        );
      }  
      private getEventMessage(event: HttpEvent<any>, formData) {

        switch (event.type) {
          case HttpEventType.UploadProgress:
            return this.fileUploadProgress(event);
        break;
          case HttpEventType.Response:
            return this.apiResponse(event);
        break;
          default:
            return `File "${formData.get('profile').name}" surprising upload event: ${event.type}.`;
        }
      }
      private fileUploadProgress(event) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { status: 'progress', message: percentDone };
      }
    
      private apiResponse(event) {
        return event.body;
      }
    
      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened. Please try again later.');
      }    
      

//file upload service ends here

  getCountry() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
  }
  getDepartments() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Departments`)
  }
  
  getDocumentType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/DocumentTypes`)
  }
  getContracts() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Contracts`)
  }
  getBuyers() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`);
  }
  getSellers() {
    return this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`);
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
  getLoom() {
    return this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllLoomType`)
  }
  getColor() {
    return this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllColor`)
  }
  getFabricType() {
    return this.http.get(`${environment.apiUrl}/api/Products/GetAllFabricType`)
  }
  getEnquiryItem() {
    return this.http.get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiryItem`);
  }
  getCurrency() {
    return this.http.get(`${environment.apiUrl}/api/Configs/GetAllCurrencyRate`);
  }
  getVendorSeller() {
    return this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`);
  }




  login(loginData) {
    return this.http.get(`${environment.apiUrl}/api/Auth/Login`)
  }

  //  -------------Fetch function for all components --------------------------------//

  fetch(cb, apiUrl2) {
    let desc = this;
    desc.http
      .get(`${environment.apiUrl}` + apiUrl2)
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
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  // ------------------------------------ Export as CSV file -----------------------------------//

  public exportAsCsvFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    this.saveAsCsvFile(excelBuffer, excelFileName);
  }

  private saveAsCsvFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: CSV_TYPE
    });
    FileSaver.saveAs(data, fileName + CSV_EXTENSION);
  }



}



function cb(data: any) {
  throw new Error('Function not implemented.');
}

