import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-agent-form',
  templateUrl: './add-agent-form.component.html',
  styleUrls: ['./add-agent-form.component.css']
})
export class AddAgentFormComponent implements OnInit {
  data:any={};
  response: any;
  // agentSide=null;
  // agentType = null;
  city: any = [];
  banks: any = [];
  Side: any = [];
  Type:any=[];


  constructor(private http:HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal ) { }

  ngOnInit(): void {

    this.getCity();
    this.getBanks();
    this.GetAgentSide();
    this.GetAgentType();
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
                    this.toastr.error(this.response.message, 'Message.');

          }

        }, err => {
          if (err.status == 400) {
                    this.toastr.error(this.response.message, 'Message.');

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
                   this.toastr.error(this.response.message, 'Message.');

          }

        }, err => {
          if (err.status == 400) {
                    this.toastr.error(this.response.message, 'Message.');

          }
        });
  }

  GetAgentSide() {
    this.service.getAgentSide().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.Side = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetAgentType() {
    this.service.getAgentType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.Type= this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  addAgent()
  {
    this.http.
    post(`${environment.apiUrl}/api/Configs/AddExternalAgent`,this.data)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(true);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
            }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }
  }





// }