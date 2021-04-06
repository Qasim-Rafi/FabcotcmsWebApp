import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddLoomTypeComponent } from './add-loom-type/add-loom-type.component';
import { EditLoomTypeComponent } from './edit-loom-type/edit-loom-type.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-loom-type',
  templateUrl: './loom-type.component.html',
  styleUrls: ['./loom-type.component.css']
})
export class LoomTypeComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  myDate = Date.now();
  temp: any = [];

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
      return d.type.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/TextileGarments/GetAllLoomType`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.response.data.length;
        if (this.response.success == true) {
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



  deleteLoom(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.type +'"',
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteLoomType/` + id.id)
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



  addLoomForm() {
    const modalRef = this.modalService.open(AddLoomTypeComponent, { centered: true });
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


  editLoomForm(row) {
    const modalRef = this.modalService.open(EditLoomTypeComponent, { centered: true });
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
// excel ///
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    LoomType :row.type,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Loom Type');
  
  }

  // pdf ////
  generatePDF() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Loom Type List'
      },
      content: [
        {
          text: 'Loom Type List',
          style: 'heading',
  
        },
  
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170 ],
            body: [
              ['S.no.', 'Loom Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
              ...this.data.map(row => (
                [row.id, row.type, row.description, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime + '|' + row.updatedByName 
                 ] 
              ))
            ]
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }
  
    };
  
  
    pdfMake.createPdf(docDefinition).download('LoomType.pdf');
  }

  // print

  printPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Loom Type List'
      },
      content: [
        {
          text: 'Loom Type List',
          style: 'heading',
  
        },
  
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170 ],
            body: [
              ['S.no.', 'Loom Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
              ...this.data.map(row => (
                [row.id, row.type, row.description, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime + '|' + row.updatedByName 
                 ] 
              ))
            ]
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }
  
    };
  
  
    pdfMake.createPdf(docDefinition).print();
  }

}

