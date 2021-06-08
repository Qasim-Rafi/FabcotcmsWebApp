import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-and-specification',
  templateUrl: './product-and-specification.component.html',
  styleUrls: ['./product-and-specification.component.css']
})
export class ProductAndSpecificationComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  // @Input() contractId;
  data:any ={};
  response: any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

}
