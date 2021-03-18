import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentFormComponent } from './add-agent-form/add-agent-form.component';
import { EditAgentFormComponent } from './edit-agent-form/edit-agent-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';

@Component({
  selector: 'app-foreign-agent',
  templateUrl: './foreign-agent.component.html',
  styleUrls: ['./foreign-agent.component.css']
})
export class ForeignAgentComponent implements OnInit {
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  date: number;
  myDate = Date.now();
  temp: any[];

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }

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
      return d.code.toLowerCase().indexOf(val) !== -1 ||
        d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }



  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Configs/GetAllExternalAgent`)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          that.data = this.response.data;
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




  deleteAgent(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage, //"You won't be able to revert this!",
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteExternalAgent/` + id.id)
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






















  addAgentForm() {
    const modalRef = this.modalService.open(AddAgentFormComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.fetch((data) => {
          this.temp = [...data];
          this.rows = data;
          this.listCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }



  editAgentForm(row) {
    const modalRef = this.modalService.open(EditAgentFormComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }




}
