import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service'
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { GlobalConstants } from 'src/app/Common/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddEditSelvedgeComponent } from './add-edit-selvedge/add-edit-selvedge.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-selvedge',
  templateUrl: './selvedge.component.html',
  styleUrls: ['./selvedge.component.css']
})
export class SelvedgeComponent implements OnInit {

  selvedgeCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  copyData: any = [];
  currentDate = Date.now();
  selvedgeFilter: any = [];
  selvedgeUrl = '/api/FLConfigs/GetAllSelvedge'

  @ViewChild('myTable', { static: false }) table: DatatableComponent;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.selvedgeFilter = [...this.rows];

      this.selvedgeCount = this.rows.length;
    }, this.selvedgeUrl);

  }


  // ------------------- Search function ----------------------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.selvedgeFilter.filter(function (d) {
      return (d.pickInsetionName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  //  --------------------- Delete Pick Insertion ---------------------------//

  deleteselvedge(id) {

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.selvedgeName + '"',
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
this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/FLConfigs/DeleteSelvedge/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.selvedgeUrl);
this.spinner.hide();
              }
              else {
                this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
             this.spinner.hide();
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              this.spinner.hide();
              }
            });
      }
    })

  }

  //  ----------------------- Add Pick Insertion Form -----------------------//

  addselvedgeForm(check, name) {
    const modalRef = this.modalService.open(AddEditSelvedgeComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {

      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
      this.selvedgeFilter = [...this.rows];

          this.selvedgeCount = this.rows.length;
        }, this.selvedgeUrl);
      }
    }, (reason) => {
    });
  }

  // ---------------------- Edit Pick Insertion Form ----------------------//


  editselvedgeForm(row, check, name) {
    const modalRef = this.modalService.open(AddEditSelvedgeComponent, { centered: true });
    modalRef.componentInstance.selvedgeId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        }, this.selvedgeUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  // --------------------------Export as Excel file----------------------------------//


  selvedgeExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      selvedgeName: row.name,
      description: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Countries');

  }

// -------------------------------- Export as CSV file --------------------------------//

selvedgeCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    selvedgeName: row.name,
    Details: row.details,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + ' | ' + row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'Countries');

}

  // -------------------------------Export as Pdf  ------------------------------------//

  selvedgePdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'selvedge List'
      },
      content: [
        {
          text: 'selvedge List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'selvedge', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.selvedgeName, row.description,
                row.active == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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


    pdfMake.createPdf(docDefinition).download('selvedgeList.pdf');
  }

  //-------------------------------------- Print Pick Insertion List ------------------------- ///

  printselvedgeList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'selvedge List'
      },
      content: [
        {
          text: 'selvedge List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'selvedge', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.selvedgeName, row.description,
                row.active == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

  }


  //------------------------------------ Copy Pick Insertion list --------------------///

  copyselvedgeList() {
    let count1 = this.rows.map(x => x.selvedgeName.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));
    let count3 = this.rows.map(x => x.details.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));
    let count4 = this.rows.map(x => x.active == true ? "Active".length : "In-Active".length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    max1 = max1 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'Pick Insertion Name'.padEnd(max1) + 'Details'.padEnd(max3) + 'Status'.padEnd(max4) + 'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].selvedgeName.padEnd(max1) + this.rows[i].details.padEnd(max3)
        + this.rows[i].active
        + this.rows[i].createdDateTime + this.rows[i].createdByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.selvedgeCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}
