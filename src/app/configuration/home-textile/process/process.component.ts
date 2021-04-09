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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  processCount: number;
  processFilter: any = [];
  processUrl = '/api/TextileGarments/GetAllProcess'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.processFilter = [...data];
      this.rows = data;
      this.processCount = this.rows.length;
    }, this.processUrl);
  }

  //  ---------------------------- Search Function ------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.processFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });

    this.rows = temp;
  }

  // -------------------------- delete Process ----------------------------//

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
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.processCount = this.rows.length;
                }, this.processUrl);

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

  // -------------------------------- Add Process Form -----------------------------//

  addProcessForm() {
    const modalRef = this.modalService.open(AddProcessComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.processCount = this.rows.length;
        }, this.processUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------- Edit Process Form ------------------------------//

  editProcessForm(row) {
    const modalRef = this.modalService.open(EditProcessComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
        }, this.processUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }

  // -------------------------------Export as Excel File ----------------------------//

  processExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      ProcessName: row.name,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'Process');

  }
 // -------------------------------Export as CSV File ----------------------------//

 processCsvFile() {

  const filtered = this.rows.map(row => ({
    SNo: row.id,
    ProcessName: row.name,
    Details: row.description,
    Status: row.active == true ? "Active" : "In-Active",
    LastChange: row.updatedDateTime + '|' + row.updatedByName
  }));

  this.service.exportAsCsvFile(filtered, 'Process');

}

  // ------------------------------Export as Pdf --------------------------------------//

  processPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Process List'
      },
      content: [
        {
          text: 'Process List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Process Name', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
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


    pdfMake.createPdf(docDefinition).download('Process.pdf');
  }

  // -----------------------------------print Process List ------------------------------// 

  printProcessList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Process List'
      },
      content: [
        {
          text: 'Process List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Process Name', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
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

