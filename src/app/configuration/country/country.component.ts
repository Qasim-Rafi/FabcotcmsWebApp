import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCountryComponent } from './edit-country/edit-country.component';
// import { AddCountryComponent } from './add-country/add-country.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {ServiceService}  from 'src/app/shared/service.service'
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countryCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  currentDate = Date.now();
  countryFilter: any=[];
 
  @ViewChild('myTable') table: DatatableComponent;
 

  constructor(private http: HttpClient,
              private toastr: ToastrService,
              private modalService: NgbModal, 
              private service:ServiceService,
              private clipboardService: ClipboardService) { }
  
  ngOnInit(): void {
    this.fetch((data) => {
      this.countryFilter = [...data];
      this.rows = data;
      this.countryCount = this.rows.length;
    });

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.countryFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1  || !val);
    });
 
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }



  fetch(cb) {
    let desc = this;
    desc.http
      .get(`${environment.apiUrl}/api/Configs/GetAllCountry`)
      .subscribe(res => {
        this.response = res;
        // this.listCount = this.fetch.length;
        if (this.response.success == true) {
          this.countryCount = this.response.data.length;

          desc.data = this.response.data;
          cb(this.data);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }


  deleteCountry(id) {

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.name +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCountry/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });

              }
              else {
                this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });


        // Swal.fire(
        //   'Record',
        //   'Deleted Successfully.',
        //   'success'
        // )
      }
    })

  }

  addCountryForm(check , name) {
    const modalRef = this.modalService.open(EditCountryComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
          this.countryCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editCountryForm(row , check , name) {
    const modalRef = this.modalService.open(EditCountryComponent, { centered: true });
    modalRef.componentInstance.countryId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
        });

      }
    }, (reason) => {
      // on dismiss
    });
  }
 

// excel


exportAsXLSX():void {

  this.service.exportAsExcelFile(this.data, 'Country List');
 
  }

//   copyContent() {
//     let array = []
//    let rows = this.table.bodyComponent.rows;
//    function createStringByArray(array) {
//     var output = '';
//         forEach(array, function (object) {
//         forEach(object, function (value, key) {
//             output += key + ',';
//             output += value + ',';
//         });
//     });
//     return output;
// }

//     // let copy =     this.rows.join(',')
//     // this.clipboardService.copyFromContent(array)
//   }
}
