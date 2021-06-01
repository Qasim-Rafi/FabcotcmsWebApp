import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { EditCountryComponent } from './edit-country/edit-country.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service'
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AddEditShipmentLineComponent } from './add-edit-shipment-line/add-edit-shipment-line.component';

@Component({
  selector: 'app-shipment-line',
  templateUrl: './shipment-line.component.html',
  styleUrls: ['./shipment-line.component.css']
})
export class ShipmentLineComponent implements OnInit {
rows : [];
columns : [];
shipmentFilter : [];
shipmentCount : any;
shipmentUrl:any;
constructor(private http: HttpClient,
  private toastr: ToastrService,
  private modalService: NgbModal,
  private service: ServiceService,
  private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
  }

  addShipmentForm(check) {
    const modalRef = this.modalService.open(AddEditShipmentLineComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
  
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.shipmentFilter = [...this.rows];
  
          this.shipmentCount = this.rows.length;
        }, this.shipmentUrl);
      }
    }, (reason) => {
    });
  }
  
  // ---------------------- Edit Country Form ----------------------//
  
  
  editShipmentForm(row, check) {
    const modalRef = this.modalService.open(AddEditShipmentLineComponent, { centered: true });
    modalRef.componentInstance.Id = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.shipmentFilter = [...this.rows];
        }, this.shipmentUrl);
  
      }
    }, (reason) => {
      // on dismiss
    });
  }
}
