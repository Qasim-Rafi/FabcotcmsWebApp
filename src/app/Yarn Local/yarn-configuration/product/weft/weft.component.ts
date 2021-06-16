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
import { AddEditWeftComponent } from './add-edit-weft/add-edit-weft.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-weft',
  templateUrl: './weft.component.html',
  styleUrls: ['./weft.component.css']
})
export class WeftComponent implements OnInit {

  BlendingRatioWeftCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  copyData: any = [];
  currentDate = Date.now();
  BlendingRatioWeftFilter: any = [];
  BlendingRatioWeftUrl = '/api/FLConfigs/GetAllBlendingRatioWeft'

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
      this.BlendingRatioWeftFilter = [...this.rows];

      this.BlendingRatioWeftCount = this.rows.length;
    }, this.BlendingRatioWeftUrl);

  }


  // ------------------- Search function ----------------------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.BlendingRatioWeftFilter.filter(function (d) {
      return (d.blendingRatioWeftName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  //  --------------------- Delete Pick Insertion ---------------------------//

  deleteBlendingRatioWeft(id) {

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.blendingRatioWeftName + '"',
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
        this.http.delete(`${environment.apiUrl}/api/FLConfigs/DeleteBlendingRatioWeft/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.BlendingRatioWeftUrl);
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

  addBlendingRatioWeftForm(check, name) {
    const modalRef = this.modalService.open(AddEditWeftComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {

      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
      this.BlendingRatioWeftFilter = [...this.rows];

          this.BlendingRatioWeftCount = this.rows.length;
        }, this.BlendingRatioWeftUrl);
      }
    }, (reason) => {
    });
  }

  // ---------------------- Edit Pick Insertion Form ----------------------//


  editBlendingRatioWeftForm(row, check, name) {
    const modalRef = this.modalService.open(AddEditWeftComponent, { centered: true });
    modalRef.componentInstance.BlendingRatioWeftId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        }, this.BlendingRatioWeftUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  // --------------------------Export as Excel file----------------------------------//


  BlendingRatioWeftExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      blendingRatioWeftName: row.name,
      description: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'BlendingRatioWeft');

  }

// -------------------------------- Export as CSV file --------------------------------//

BlendingRatioWeftCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    blendingRatioWeftName: row.name,
    Details: row.details,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + ' | ' + row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'BlendingRatioWeft');

}

  // -------------------------------Export as Pdf  ------------------------------------//

  BlendingRatioWeftPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'BlendingRatioWeft List'
      },
      content: [
        {
          text: 'BlendingRatioWeft List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'BlendingRatioWeft', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.blendingRatioWeftName, row.description,
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


    pdfMake.createPdf(docDefinition).download('BlendingRatioWeftList.pdf');
  }

  //-------------------------------------- Print Pick Insertion List ------------------------- ///

  printBlendingRatioWeftList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'BlendingRatioWeft List'
      },
      content: [
        {
          text: 'BlendingRatioWeft List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'BlendingRatioWeft', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.blendingRatioWeftName, row.description,
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

  copyBlendingRatioWeftList() {
    let count1 = this.rows.map(x => x.blendingRatioWeftName.length);
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
      let tempData = this.rows[i].id + this.rows[i].blendingRatioWeftName.padEnd(max1) + this.rows[i].details.padEnd(max3)
        + this.rows[i].active
        + this.rows[i].createdDateTime + this.rows[i].createdByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.BlendingRatioWeftCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}
