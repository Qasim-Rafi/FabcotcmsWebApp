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
import { AddContainerComponent } from './add-container/add-container.component';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  countryCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  copyData: any = [];
  currentDate = Date.now();
  containerFilter: any = [];
  ContainerUrl = '/api/YarnConfigs/GetAllContainer'

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
      this.containerFilter = [...this.rows];

      this.countryCount = this.rows.length;
    }, this.ContainerUrl);

  }


  // ------------------- Search function ----------------------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.containerFilter.filter(function (d) {
      return (d.containerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  //  --------------------- Delete Country ---------------------------//

  deleteContainer(id) {

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
this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/YarnConfigs/DeleteContainer/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.ContainerUrl);
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

  addCountryForm(check, name) {
    const modalRef = this.modalService.open(AddContainerComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {

      if (data == true) {
       
     
      }
      this.service.fetch((data) => {
        this.rows = data;
        this.containerFilter = [...this.rows];
      }, this.ContainerUrl);
    }, (reason) => {
    });
  }

  // ---------------------- Edit Country Form ----------------------//


  editCountryForm(row, check, name) {
    const modalRef = this.modalService.open(AddContainerComponent, { centered: true });
    modalRef.componentInstance.containerId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        }, this.ContainerUrl);

      }
      
    }, (reason) => {
      // on dismiss
    });
  }


  // --------------------------Export as Excel file----------------------------------//


  countryExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      CountryName: row.name,
      Details: row.details,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Countries');

  }

// -------------------------------- Export as CSV file --------------------------------//

countryCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    CountryName: row.name,
    Details: row.details,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + ' | ' + row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'Countries');

}

  // -------------------------------Export as Pdf  ------------------------------------//

  countryPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Container List'
      },
      content: [
        {
          text: 'Container List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Container Size', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.containerName, row.description,
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


    pdfMake.createPdf(docDefinition).download('Container.pdf');
  }

  //-------------------------------------- Print country List ------------------------- ///

  printCountryList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Container List'
      },
      content: [
        {
          text: 'Container List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Container', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.containerName, row.description,
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

  copyCountryList() {
    let count1 = this.rows.map(x => x.containerName.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));
    let count3 = this.rows.map(x => x.description.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));
    let count4 = this.rows.map(x => x.active == true ? "Active".length : "In-Active".length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    max1 = max1 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'Container Name'.padEnd(max1) + 'Details'.padEnd(max3) + 'Status'.padEnd(max4) + 'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].containerName.padEnd(max1) + this.rows[i].description.padEnd(max3)
        + this.rows[i].active
        + this.rows[i].createdDateTime + this.rows[i].createdByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.countryCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}