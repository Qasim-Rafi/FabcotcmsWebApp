import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCityComponent } from './edit-city/edit-city.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ServiceService } from 'src/app/shared/service.service';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  CityCount: number;
  response: any;
  rows: any = [];
  // countryId= null;
  columns: any = [];
  data: any = {};
  cityDate = Date.now();
   temp:any=[];
  @ViewChild('myTable') table: DatatableComponent;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
    });

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ( d.name.toLowerCase().indexOf(val) !== -1  ||
      d.country.toLowerCase().indexOf(val) !== -1  || !val);
    });
 
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Configs/GetAllCity`)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.CityCount = this.response.data.length;
          that.data = this.response.data;
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




  deleteCity(id) {
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCity/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });

              }
              else {
                this.toastr.error(this.response.message, 'Message.');
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
  addCity(check,name) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.statusCheck =check;
    modalRef.componentInstance.FormName = name;

   //  modalRef.componentInstance.name =componentName;

       modalRef.result.then((data) => {
      // on close
       if(data ==true){
       //  this.date = this.cityDate;
        this.fetch((data) => {
         this.rows = data;
         this.CityCount = this.rows.length;
       });
        

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editCity(row,check,name){
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.cityId =row.id; //just for edit.. to access the needed row
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;

          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.cityDate;
           this.fetch((data) => {
            this.rows = data;
          });
         }
       }, (reason) => {
         // on dismiss
       });
  } 
}

