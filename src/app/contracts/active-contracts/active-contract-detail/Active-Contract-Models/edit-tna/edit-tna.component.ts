import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from 'src/app/shared/dateformater';
import { GlobalConstants } from 'src/app/Common/global-constants';


@Component({
  selector: 'app-edit-tna',
  templateUrl: './edit-tna.component.html',
  styleUrls: ['./edit-tna.component.css']
})
export class EditTnaComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
@Input() tnaId;
// @Input() id;

  @Input() contractId;
  data:any ={};
  response: any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }


  getTnaData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractTimeActionById/` + this.tnaId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.startDate = this.dateformater.fromModel(this.data.startDate);
            this.data.endDate = this.dateformater.fromModel(this.data.endDate);
            
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
  
  UpdateTna() {
    this.data.startDate = this.dateformater.toModel(this.data.startDate);
    this.data.endDate = this.dateformater.toModel(this.data.endDate);
    let varr = {
      "tnaId": this.tnaId,
      "startDate": this.data.startDate,
      "endDate": this.data.endDate,
      "quantity": this.data.quantity.toString(),
      "details": this.data.details
    }

    this.http.put(`${environment.apiUrl}/api/Contracts/UpdateContractTimeAction/` + this.tnaId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
  }
}
