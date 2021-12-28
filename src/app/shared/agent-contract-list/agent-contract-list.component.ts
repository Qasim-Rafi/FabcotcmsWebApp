import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
// import { Dateformater } from '../../dateformater';
// import { ServiceService } from '../../service.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-agent-contract-list',
  templateUrl: './agent-contract-list.component.html',
  styleUrls: ['./agent-contract-list.component.css']
})
export class AgentContractListComponent implements OnInit {
  @Input() dataR;
  data: any = [];
  response: any;
  constructor(
    private http:HttpClient,
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.getByid();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getByid()
  {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Reports/getContractOwnerIndentlist/`+this.dataR.contractOwnerId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
          this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        this.spinner.hide();   
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
      
        }
      });
  }
}
