import { HttpClient } from '@angular/common/http';
import { Component, Input,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-tna-log-history',
  templateUrl: './tna-log-history.component.html',
  styleUrls: ['./tna-log-history.component.css']
})


export class TnaLogHistoryComponent implements OnInit {
  @Input() id;

  columns: any = [];
  rows: any = [];
  data:any ={};
  Length:any;

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
  
     
  
    this.getTnaData((data)=>
    {
      if(data.length === 0){
        this.activeModal.dismiss();
      }
      this.rows = data;
            

    }
    )
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getTnaData(cb) {


    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractTimeActionLogHistory/` + this.id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
           if(this.data.length == 0)
           {
             this.toastr.error("No Log History available"  , 'Message');
           }
           
            cb(this.data)
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
