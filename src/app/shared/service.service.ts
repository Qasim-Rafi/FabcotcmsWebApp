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
import {NgxSpinnerService} from 'ngx-spinner'

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  response: any;
  buyer: any = [];
  article: any = [];
  listCount: number;
  data: any = [];
  user: any;
  rootUrl: "/api/Auth/Login";

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner : NgxSpinnerService)
     { }

  userAuthentication(data) {
    // var data = "username=" + username + "&password=" + password + "&grant_type=password";
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    // return this.http.post('/api/Auth/Login' + '/token', data, { headers: reqHeader });


    return this.http.post(`${environment.apiUrl}/api/auth/login`, data)
      .pipe(
        map((res: any) => {
          this.response = res;
          //if(this.response.massage){}
          if (this.response.success == true) {
            this.user = this.response.data;
          }
          if (this.user) {


            localStorage.setItem('token', this.user.token);
            localStorage.setItem('role', this.user.role);
            localStorage.setItem('loggedInUserName', this.user.loggedInUserName);
            // localStorage.setItem('loggedInDepartment', this.user.loggedInDepartment);
            localStorage.setItem('loggedInDepartmentId', this.user.loggedInDepartmentId);
            localStorage.setItem('loggedInDepartmentName', this.user.loggedInDepartmentName);
            localStorage.setItem('loggedInDepartmentCode', this.user.loggedInDepartmentCode);
            localStorage.setItem('loggedInUserId', this.user.loggedInUserId);
            
            //this.authenticateUser(this.userRole);
            //     setTimeout(()=>{                           
            //       localStorage.removeItem('token');
            //        this.router.navigate(['/first-page']);
            //  }, 172800000);





            return this.response;
          }
          return this.response;
        })

      );
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
  getSellerLookup() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Sellers`);
  }
  getcommisionpaynentSellerLookup() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/GetCommisionPaymentsSellers`);
  }
  GetSellerDropdownbydepartment() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/GetSellersAllbydepartment`);
  }
  getBuyersPOC(id) {
    return this.http.get(`${environment.apiUrl}/api/Lookups/BuyerPOCsByBuyerId/`+id);
  }
  getSellers() {
    return this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`);
  }
  getSellersPOC(id) {
    return this.http.get(`${environment.apiUrl}/api/Lookups/SellerPOCsBySellerId/`+id);
  }
  getAgents() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/ExternalAgents`)
  }
  getArticles() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Articles`)
  }
  getPaymentTerm() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PaymentTerms`)
  }
  getPaymentMode() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PaymentModes`)
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
  getCapabilities() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Capabilities`)
  }
getAgentSide(){
  return this.http.get(`${environment.apiUrl}/api/Lookups/AgentSide`)
}
getAgentType(){
  return this.http.get(`${environment.apiUrl}/api/Lookups/AgentType`)
}
  getPriceTerm() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PriceTerms`)

  }
  getCity() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Destinations`)
  }
  getDestination() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Destinations`)
  }
  getMode() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/ShipmentModes`)
  }
  
// ​/api​/Lookups​/UOMs
  getUOM() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/UOMs`)
  }
  getLoom() {
    return this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllLoomType`)
  }
  getWeave() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Weaves`)
  }
  getBrWarp() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/BlendingRatioWarps`)
  }
  getContainer() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Containers`)
  }
  getBrWeft() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/BlendingRatioWefts`)
  }
  getPickInsertion() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PickInsertions`)
  }
  getPieceLength() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PieceLengths`)
  }
  getColor() {
    return this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllColor`)
  } 
  getSelvedge() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Selvedges`)
  }
  getFabricType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/FabricTypes`)
  }
  getEnquiryItem() {
    return this.http.get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiryItem`);
  }
  getCurrency() {
    return this.http.get(`${environment.apiUrl}/api/Configs/GetAllCurrencyRate`);
  }
  getCurrencyType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/CurrencyTypes`);
  }
  getVendorSeller(enquiryId) {
    return this.http.get(`${environment.apiUrl}/api/Lookups/SellerFromQuotations/` + enquiryId);
  }
  getUserType() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/UserTypes`);
  }
  getDepartment() {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Departments`);
  }
  getCriteria(id) {
    return this.http.get(`${environment.apiUrl}/api/Lookups/BeneficiaryDetail/` + id);
  }
  getUsers() {
    return this.http.get(`${environment.apiUrl}/api/Users/GetUsers`);
  }


  login(loginData) {
    return this.http.get(`${environment.apiUrl}/api/Auth/Login`)
  }

  //  -------------Fetch function for all components --------------------------------//

  fetch(cb, apiUrl2) {
    // this.spinner.show();

    let desc = this;
    desc.http
      .get(`${environment.apiUrl}` + apiUrl2)
      .subscribe(res => {
        this.response = res;
        if(this.response.data != null){
        if (this.response.success == true ) {
         
          this.listCount = this.response.data.length;

          desc.data = this.response.data;
          cb(this.data);
          // this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          // this.spinner.hide();

          }
        }
       
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
          this.spinner.hide();

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

  extractErrorMessagesFromErrorResponse(errorResponse: HttpErrorResponse) {
    // 1 - Create empty array to store errors
    const errors = [];

    // 2 - check if the error object is present in the response
    if (errorResponse.error) {

      // 4 - Check for Laravel form validation error messages object
      if (errorResponse.error.errors) {

        // 5 - For each error property (which is a form field)
        for (const property in errorResponse.error.errors) {

          if (errorResponse.error.errors.hasOwnProperty(property)) {

            // 6 - Extract it's array of errors
            const propertyErrors: Array<string> = errorResponse.error.errors[property ];

            // 7 - Push all errors in the array to the errors array
            propertyErrors.forEach(error => errors.push(error.split('|')));
          }

        }
    
      }

    }
    return errors;
  }
}


