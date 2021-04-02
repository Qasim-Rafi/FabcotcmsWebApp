import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddProcessComponent } from './add-process/add-process.component';
import { EditProcessComponent } from './edit-process/edit-process.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  myDate = Date.now();
  temp: any = [];
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }




  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/TextileGarments/GetAllProcess`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.response.data.length;
        if (this.response.success == true) {
          that.data = this.response.data;
          this.temp = [...this.data];

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




  deleteProcess(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.name + '"',
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteProcess/` + id.id)
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



  addProcessForm() {
    const modalRef = this.modalService.open(AddProcessComponent, { centered: true });
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


  editProcessForm(row) {
    const modalRef = this.modalService.open(EditProcessComponent, { centered: true });
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

  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo: row.id,
      ProcessName: row.name,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName


    }));

    this.service.exportAsExcelFile(filtered, 'Process');

  }


}

