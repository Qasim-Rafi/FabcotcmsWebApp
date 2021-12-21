import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-mappings',
  templateUrl: './add-edit-mappings.component.html',
  styleUrls: ['./add-edit-mappings.component.css']
})
export class AddEditMappingsComponent implements OnInit {
  response: any;
  data: any = {};
  obj: any = {};
  
  @Input() mapping;
  @Input() id;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }

  ngOnInit(): void {
    
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  updateCode() {
    
    let varr = {
      "sellerId": this.mapping.sellerId,
      "accountCode": this.mapping.accountCode,
      "party_Coa": this.mapping.party_Coa,
      "sale_Tax_Coa": this.mapping.sale_Tax_Coa,

    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Sellers/UpdateSellerAccountMappings/` + this.id , varr)
      .subscribe(
        res => {
        

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        this.spinner.hide();

        });
  }
  addCode() {
 
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Sellers/AddSellerAccountMappings/` + this.mapping.sellerId + '/' + this.mapping.accountCode +'/'+ this.mapping.party_Coa +'/'+ this.mapping.sale_Tax_Coa, {})
      .subscribe(
        res => {
        

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        this.spinner.hide();

        });
  }
  // editCity() {
  //   this.spinner.show();
  //   this.http.get(`${environment.apiUrl}/api/Configs/GetCityById/` + this.id)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {

  //           this.data = this.response.data;
  //           this.spinner.hide();
  //         }
  //         else {
  //           this.toastr.error(this.response.message, 'Message.');
  //        this.spinner.hide();
  //         }

  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error(this.response.message, 'Message.');
  //         this.spinner.hide();
  //         }
  //       });
  // }
}
