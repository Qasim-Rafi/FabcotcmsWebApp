import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service'
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit {
  countryCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  copyData: any =[];
  currentDate = Date.now();
  countryFilter: any = [];
  CountryUrl = '/api/Configs/GetAllCountry'
  @ViewChild('myTable', { static: false }) table:DatatableComponent;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService,
    private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.service.fetch((data ) => {
      this.countryFilter = [...data];
      this.rows = data;
      this.countryCount = this.rows.length;
    } , this.CountryUrl);

  }

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.countryFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  deleteCountry(id) {

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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCountry/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                } , this.CountryUrl);

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

  addCountryForm(check, name) {
    const modalRef = this.modalService.open(EditCountryComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
          this.countryCount = this.rows.length;
        } , this.CountryUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editCountryForm(row, check, name) {
    const modalRef = this.modalService.open(EditCountryComponent, { centered: true });
    modalRef.componentInstance.countryId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        } , this.CountryUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  // excel


  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      Sno: row.id,
      CountryName: row.name,
      Details: row.details,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Countries');

  }
  // pdf 
  generatePDF() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Country List'
      },
      content: [
        {
          text: 'Country List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Country', 'Details', 'Status', 'Created On| Created By'],
              ...this.data.map(row => (
                [row.id, row.name, row.details, 
                  row.active == true ? "Active" : "In-Active", row.createdDateTime+ '|'+ row.createdByName]
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


    pdfMake.createPdf(docDefinition).download('CountryList.pdf');
  }

// print pdf ///

printPdf() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Country List'
    },
    content: [
      {
        text: 'Country List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 90, 130, 50, 150],
          body: [
            ['S.no.', 'Country', 'Details', 'Status', 'Created On| Created By'],
            ...this.data.map(row => (
              [row.id, row.name, row.details, 
                row.active == true ? "Active" : "In-Active", row.createdDateTime+ '|'+ row.createdByName]
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

  const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print({}, win);
    // win.close();
}


// copy

copy() {
  // let count = this.rows.map(x => x.id.length);
  // let max = count.reduce((a, b) => Math.max(a, b));

  let count1 = this.rows.map(x => x.name.length);
  let max1 = count1.reduce((a, b) => Math.max(a, b));
  let count3 = this.rows.map(x => x.details.length);
  let max3 = count3.reduce((a, b) => Math.max(a, b));
  let count4 = this.rows.map(x => x.active== true ? "Active".length : "In-Active".length);
  let max4 = count4.reduce((a, b) => Math.max(a, b));
  max1 = max1 + 10;
  max3 = max3 + 10;
  max4 = max4 + 10;

  // ................................................ headings replace yours............................

  this.copyData.push('S No.' +'Country Name'.padEnd(max1) + 'Details'.padEnd(max3)+'Status'.padEnd(max4)+'Changed On'+'| Changed By \n');
  // ................................................ headings............................

  // ................................................ coloum data...........replace your coloum names.................
  for (let i = 0; i < this.rows.length; i++) {
    let tempData = this.rows[i].id + this.rows[i].name.padEnd(max1) +  this.rows[i].details.padEnd(max3) 
    +this.rows[i].active
    + this.rows[i].createdDateTime + this.rows[i].createdByName +'\n';
    this.copyData.push(tempData);
  }
  this._clipboardService.copy(this.copyData)
  // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

  Swal.fire({
    title: GlobalConstants.copySuccess, 
    footer:'Copied'+'\n'+this.countryCount+'\n'+'rows to clipboard',
     showConfirmButton: false,
     timer:2000,
  })
}

}
