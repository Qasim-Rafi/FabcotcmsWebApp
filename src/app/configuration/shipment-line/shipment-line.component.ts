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
rows :any = [];
columns :any=[];
response: any;
shipmentFilter :any = [];
shipmentCount : any;
shipmentUrl = '/api/Configs/GetAllShipmentLine'
constructor(private http: HttpClient,
  private toastr: ToastrService,
  private modalService: NgbModal,
  private service: ServiceService,
  private _clipboardService: ClipboardService) { }

  ngOnInit(): void {

    this.service.fetch((data) => {
      this.rows = data;
      this.shipmentFilter = [...this.rows];
      this.shipmentCount = this.rows.length
    }, this.shipmentUrl);
  }




  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.shipmentFilter.filter(function (d) {
      return (
        // d.code.toLowerCase().indexOf(val) !== -1 ||
        d.shipmentLineType.toLowerCase().indexOf(val) !== -1 ||
        d.shipmentMode.toLowerCase().indexOf(val) !== -1 ||
        // d.genericName.toLowerCase().indexOf(val) !== -1 || 
        !val);
    });
    this.rows = temp;
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




  deleteShipment(id) {

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.shipmentLineType + '"',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ed5565',
      cancelButtonColor: '#dae0e5',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      reverseButtons: true,
      position: 'top',
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteShipmentLine/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;

                }, this.shipmentUrl);

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
    })

  }





}
