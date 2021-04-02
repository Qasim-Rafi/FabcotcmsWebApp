import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTypeComponent } from './add-type/add-type.component';
import { EditTypeComponent } from './edit-type/edit-type.component';
import { ServiceService } from 'src/app/shared/service.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';


@Component({
  selector: 'app-fabric-type',
  templateUrl: './fabric-type.component.html',
  styleUrls: ['./fabric-type.component.css']
})
export class FabricTypeComponent implements OnInit {
  response: any;
  rows: any = [];
  data: any = {};
  columns: any = [];
  listCount: number;
  myDate = Date.now();
  temp: any[];



  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
      this.listCount = this.rows.length;
    });
  }



  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.type.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }




  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Products/GetAllFabricType`)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          that.data = this.response.data;
          this.temp = [...this.data];
          this.listCount = this.response.data.length;
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



  deleteType(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle,
      text: GlobalConstants.deleteMessage + ' ' + '"' + row.type + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Products/DeleteFabricType/` + row.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                  this.listCount = this.rows.length;
                });

              }
              else {
                this.toastr.error('Something went Worng', 'Message.');
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




  addTypeForm() {
    const modalRef = this.modalService.open(AddTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
          this.listCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editTypeForm(row) {
    const modalRef = this.modalService.open(EditTypeComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
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

  // excell
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo: row.id,
      FabricType: row.type,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.createdDateTime + '|' + row.createdByName


    }));

    this.service.exportAsExcelFile(filtered, 'Fabric Type');

  }

}
