import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-edit-shipment-line',
  templateUrl: './add-edit-shipment-line.component.html',
  styleUrls: ['./add-edit-shipment-line.component.css']
})
export class AddEditShipmentLineComponent implements OnInit {

  response: any;
  data: any = {};
  active = true;
  @Input() Id;
  @Input() statusCheck;
  @Input() FormName;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
  
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
