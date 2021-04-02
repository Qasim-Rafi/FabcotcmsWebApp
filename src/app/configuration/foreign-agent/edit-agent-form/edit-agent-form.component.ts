import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-agent-form',
  templateUrl: './edit-agent-form.component.html',
  styleUrls: ['./edit-agent-form.component.css']
})
export class EditAgentFormComponent implements OnInit {
  @Input() userId;
  data:any={};
  response: any;
  agentTypeId: null;
  agentSideId: null;
  city: any = [];
  banks: any = [];

  constructor(private http:HttpClient,
              private toastr: ToastrService,
              private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this. getBanks();
    this.getCity();
    this.editAgent( );
  } 

  get activeModal() {
    return this._NgbActiveModal;
  }

  getCity() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetAllCity`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.city = this.response.data;
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



  getBanks() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Banks`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.banks = this.response.data;
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


  editAgent()
  {
    this.http.get(`${environment.apiUrl}/api/Configs/GetExternalAgentById/`+this.userId )
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
          this.toastr.error(this.response.message, 'Message.');
        }
      });
  }


  UpdateAgent()
  {
    let varr=  {
      "agentTypeId": this.data.agentTypeId,
      "agentSideId": this.data.agentSideId,
      "name": this.data.name,
      "address": this.data.address,
      "cityId": this.data.cityId,
      "emailAddress": this.data.emailAddress,
      "cellNumber": this.data.cellNumber,
      "landlineNumber": this.data.landlineNumber,
      "bankName": this.data.bankName,
      "accountNumber": this.data.accountNumber,
      "accountTitle": this.data.accountTitle,
      "swiftCode": this.data.swiftCode,
      "details": this.data.details
    }

    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateExternalAgent/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.activeModal.close(true);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(this.response.message, 'Message.');
        }
      });
  }
}
