import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddProcessTypeComponent } from './add-process-type/add-process-type.component';
import { EditProcessTypeComponent } from './edit-process-type/edit-process-type.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-process-type',
  templateUrl: './process-type.component.html',
  styleUrls: ['./process-type.component.css']
})
export class ProcessTypeComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  processTypeCount: number;
  processTypeFilter: any = [];

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.processTypeFilter = [...data];
      this.rows = data;
    });
  }



  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.processTypeFilter.filter(function (d) {
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
      .get(`${environment.apiUrl}/api/TextileGarments/GetAllProcessType`)
      .subscribe(res => {
        this.response = res;
        this.processTypeCount = this.response.data.length;
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




  deleteProcess(id) {
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteProcessType/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                  this.processTypeCount = this.rows.length;
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
      }
    })

  }

  addProcessTypeForm() {
    const modalRef = this.modalService.open(AddProcessTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
          this.processTypeCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editProcessTypeForm(row) {
    const modalRef = this.modalService.open(EditProcessTypeComponent, { centered: true });
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
// excel
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    ProcessType :row.type,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
  
  
    }));
   
    this.service.exportAsExcelFile(filtered, 'Process Type');
  
  }
// pdf ////

generatePDF() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Process Type List'
    },
    content: [
      {
        text: 'Process Type List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 80, 80, 50, 170 ],
          body: [
            ['S.no.', 'Process Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
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


  pdfMake.createPdf(docDefinition).download('ProcessType.pdf');
}

// print

printPdf() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Process Type List'
    },
    content: [
      {
        text: 'Process Type List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 80, 80, 50, 170 ],
          body: [
            ['S.no.', 'Process Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
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

