import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  includingBuyer: any = [];
  excludingBuyer: any = [];
  country: any = [];
  departments: any = [];
  users: any = [];
  response: any;
  data: any = [];
  obj: any = {};
  dateformater: Dateformater = new Dateformater();  
  status = true;
  FormName: any;
  userName : any;
  userrole:string;
  typeId : any;
  deptId : any;

  @Input() beneficiaryId;
  @Input() statusCheck;
  @ViewChild(NgForm) BeneficiaryForm;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void {
    this.userrole=localStorage.getItem('role');
    if(this.userrole == 'SuperAdmin'){
      this.typeId = 1 ;
   
    } 
    else if(this.userrole == 'Admin'){
      this.typeId = 2;

    } 
    else if(this.userrole == 'Manager'){
      this.typeId = 3;
  
  }
  else if(this.userrole == 'SalesExecutive'){
    this.typeId = 4;
 
  } 
this.GetExcludingBuyersDropdown();
this.GetIncludingBuyersDropdown();
 
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'BeneficiaryEdit') {
      this.editBeneficiary();
    }
    // this.editBeneficiary();
  this.getDeptDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  getDeptDropdown(){
  
      this.service.getDepartments().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.departments = this.response.data;
         
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    
  }
 getDeptDropdown2(event){
  this.deptId = event;
this.GetUsersDropdown(this.deptId);
   
   }
  //EDIT Beneficiaries

  editBeneficiary() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetBeneficiaryById/` + this.beneficiaryId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {

            this.data = this.response.data[0];
          
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }
        });
  }
  GetUsersDropdown(dept) {
    this.http.get(`${environment.apiUrl}/api/Lookups/Users/`+ 0 +'/' + dept).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.users = this.response.data;
        // this.temp = [...this.owner];
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetIncludingBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.includingBuyer = this.response.data;
        // this.newBuyer = this.response.data.lastId



      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetExcludingBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.excludingBuyer = this.response.data;
        // this.newBuyer = this.response.data.lastId


      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  //ADD Beneficiaries

  addbeneficiary() {
    // this.data.poDate = this.dateformater.toModel(this.data.poDate);
    let varr = {
      "userId": this.data.userId,
      "commission": this.data.commission,
      "status": this.status.toString(),
      "dateTime": this.dateformater.toModel(this.data.dateTime),
      "includingBuyerId":this.data.includingBuyerId,
      "commissionRatio": parseInt(this.data.commissionRatio),
      "remarks":this.data.remarks,
      "excludingBuyerId":this.data.excludingBuyerId
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Configs/AddBeneficiary`, varr)
      .subscribe(
        res => {
          // this.obj.parent = this.active;
          // this.obj.status = true;

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
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
// }

  //GET BENEFICIARY
  // getBeneficiary() {
  //   this.http.get(`${environment.apiUrl}/api/Configs/GetAllBeneficiary`)
  //     .subscribe(
  //       res => {

  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

  //         }
  //         else {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }

  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }
  //       });
  // }



  //UPDATE CITIES

  UpdateBeneficiary() {
    
    let varr = {
      "userId": this.data.userId,
      "commission": this.data.commission,
      "status": this.status.toString(),
      "dateTime": this.dateformater.toModel(this.data.dateTime),
      "includingBuyerId":this.data.includingBuyerId,
      "commissionRatio": parseInt(this.data.commissionRatio),
      "remarks":this.data.remarks,
      "excludingBuyerId":this.data.excludingBuyerId
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateBeneficiary/` + this.beneficiaryId, varr)
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

  // onSubmit(buttonType): void {
  //   if (buttonType === "addBeneficiary") {

  //     this.addbeneficiary(this.BeneficiaryForm); 
  //   }

  //   if (buttonType === "UpdateBeneficiary") {

  //     this.UpdateBeneficiary(this.BeneficiaryForm); 

  //   }

  // }

  

}

