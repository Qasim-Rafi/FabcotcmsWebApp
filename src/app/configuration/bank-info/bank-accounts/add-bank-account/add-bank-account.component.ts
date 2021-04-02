import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css']
})
export class AddBankAccountComponent implements OnInit {
  banks:any=[];
  bankId =null;
  response:any;
  data:any={};

  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
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





  addBankAccount()
  {
    let varr=  {
      "bankId": this.bankId,
      "accountName": this.data.accountName,
      "accountNumber": this.data.accountNumber,
      "iban": this.data.iban,
      "swiftCode": this.data.swiftCode,
      "type": this.data.type,
      "default": this.data.default
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Configs/AddBankAccount`,varr)
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
