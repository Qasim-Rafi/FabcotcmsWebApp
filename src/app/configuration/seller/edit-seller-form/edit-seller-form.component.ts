import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-seller-form',
  templateUrl: './edit-seller-form.component.html',
  styleUrls: ['./edit-seller-form.component.css']
})
export class EditSellerFormComponent implements OnInit {
  @Input() userId;
  data:any={};
  response: any;
  seller:any[];
  country:any=[];
  countryId = null;
  parentSellerId = null;
  machineId = null;
  capabilitiesId = null;


  constructor( private http:HttpClient,
    private toastr:ToastrService,
    private _NgbActiveModal: NgbActiveModal,) { }

    
    ngOnInit() {
      this.editSeller(this.userId);
      this.getCountry();
      this.getParentSellers();
    }
  
    get activeModal() {
      return this._NgbActiveModal;
    }



    getParentSellers()
    {
      this.http.get(`${environment.apiUrl}/api/Lookups/Sellers`)
      .subscribe(
        res=> { 
    
          this.response = res;
          if (this.response.success == true){
                this.seller =this.response.data;
           
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }
  
  
    getCountry()
    {
      this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
      .subscribe(
        res=> { 
          this.response = res;
          if (this.response.success == true){
            this.country =this.response.data;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => { 
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }
  
    
    editSeller(id)
    {
      this.http.get(`${environment.apiUrl}/api/Sellers/GetSeller/`+id )
      .subscribe(
        res=> { 
          this.response = res;
          if (this.response.success == true){
            this.data =this.response.data;
            
           
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }
  
  
  
    updateSeller()
    {
      let varr=  {
             "sellerCode": this.data.sellerCode,
             "sellerName":  this.data.sellerName,
             "billingAddress": this.data.billingAddress,
             "countryId": this.data.countryId,
             "contactNoPrimary":  this.data.contactNoPrimary,
             "contactNoSecondary":  this.data.contactNoSecondary,
             "faxNumber":  this.data.faxNumber,
             "ntnNumber":  this.data.ntnNumber,
             "gstNumber":  this.data.gstNumber,
             "machineId": this.data.machineId,
             "capabilitiesId": this.data.capabilitiesId,
             "majorStrength":  this.data.majorStrength,
             "leadTime":  this.data.leadTime,
             "sellerDetails":  this.data.sellerDetails,
             "isParentSeller": true,
             "parentSellerId": this.data.parentSellerId, 
      }
  
      this.http.
      put(`${environment.apiUrl}/api/Sellers/UpdateSeller/`+this.userId,varr)
      .subscribe(
        res=> { 
  
          this.response = res;
          if (this.response.success == true){
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
        
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }
    
  
  }
  