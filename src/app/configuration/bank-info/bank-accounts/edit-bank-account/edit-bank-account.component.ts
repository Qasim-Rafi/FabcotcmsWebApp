import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-bank-account',
  templateUrl: './edit-bank-account.component.html',
  styleUrls: ['./edit-bank-account.component.css']
})
export class EditBankAccountComponent implements OnInit {

  data:any={};
  response: any;
  banks:any=[];
  bankId:null;
  @Input() userId;
  
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }


  ngOnInit(): void {
    this.editBankAccount();
    this.getBanks();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  getBanks()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Banks`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.banks =this.response.data;
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




  editBankAccount()
  {
    this.http.get(`${environment.apiUrl}/api/Configs/GetBankAccountById/`+this.userId )
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


  UpdateBankAccount()
  {
    let varr=  {
      "bankId": this.data.bankId,
      "accountName": this.data.accountName,
      "accountNumber": this.data.accountNumber,
      "iban": this.data.iban,
      "swiftCode": this.data.swiftCode,
      "type": this.data.type,
      "default": this.data.default,
      "active": true,
    }

    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateBankAccount/`+this.userId,varr)
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

