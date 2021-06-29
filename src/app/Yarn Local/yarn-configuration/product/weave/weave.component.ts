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
import { AddWeaveComponent } from './add-weave/add-weave.component';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-weave',
  templateUrl: './weave.component.html',
  styleUrls: ['./weave.component.css']
})
export class WeaveComponent implements OnInit {

  weaveCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  copyData: any = [];
  weaveFilter: any = [];
  weaveUrl = '/api/YarnConfigs/GetAllWeave'

  @ViewChild('myTable', { static: false }) table: DatatableComponent;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private service: ServiceService,
    private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.weaveFilter = [...this.rows];

      this.weaveCount = this.rows.length;
    }, this.weaveUrl);

  }


  // ------------------- Search function ----------------------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.weaveFilter.filter(function (d) {
      return (d.weaveName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  //  --------------------- Delete weave ---------------------------//

  deleteWeave(id) {

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.weaveName + '"',
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
        this.http.delete(`${environment.apiUrl}/api/YarnConfigs/DeleteWeave/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.weaveUrl);
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

  //  ----------------------- Add country Form -----------------------//

  addWeaveForm(check, name) {
    const modalRef = this.modalService.open(AddWeaveComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {

      if (data == true) {
      
      }
      this.service.fetch((data) => {
        this.rows = data;
    this.weaveFilter = [...this.rows];

        this.weaveCount = this.rows.length;
      }, this.weaveUrl);
    }, (reason) => {
    });
  }

  // ---------------------- Edit Country Form ----------------------//


  editWeaveForm(row, check, name) {
    const modalRef = this.modalService.open(AddWeaveComponent, { centered: true });
    modalRef.componentInstance.weaveId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
       
        this.service.fetch((data) => {
          this.rows = data;
        }, this.weaveUrl);
      }
     
    }, (reason) => {
      // on dismiss
    });
  }


  // --------------------------Export as Excel file----------------------------------//


  weaveExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      WeaveName: row.weaveName,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Weaves');

  }

// -------------------------------- Export as CSV file --------------------------------//

weaveCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    WeaveName: row.weaveName,
    Details: row.description,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + ' | ' + row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'Weaves');

}

  // -------------------------------Export as Pdf  ------------------------------------//

  weavePdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Weave List'
      },
      content: [
        {
          text: 'Weave List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Weave Name', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.weaveName, row.description,
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


    pdfMake.createPdf(docDefinition).download('WeaveList.pdf');
  }

  //-------------------------------------- Print country List ------------------------- ///

  printWeaveList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Weave List'
      },
      content: [
        {
          text: 'Weave List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Weave Name', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.weaveName, row.description,
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


  //------------------------------------ Copy Country list --------------------///

  copyWeaveList() {
    let count1 = this.rows.map(x => x.weaveName.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));
    let count3 = this.rows.map(x => x.description.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));
    let count4 = this.rows.map(x => x.active == true ? "Active".length : "In-Active".length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    max1 = max1 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'Weave Name'.padEnd(max1) + 'Details'.padEnd(max3) + 'Status'.padEnd(max4) + 'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].weaveName.padEnd(max1) + this.rows[i].description.padEnd(max3)
        + this.rows[i].active
        + this.rows[i].createdDateTime + this.rows[i].createdByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.weaveCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}