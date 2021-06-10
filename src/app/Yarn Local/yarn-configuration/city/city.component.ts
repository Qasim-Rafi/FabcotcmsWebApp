import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCityComponent } from './edit-city/edit-city.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  CityCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = [];
  copyData: any = [];
  cityDate = Date.now();
  cityFilter: any = [];
  cityUrl = '/api/Configs/GetAllCity'

  @ViewChild('myTable') table: DatatableComponent;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private _clipboardService: ClipboardService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.cityFilter = [...this.rows];

      this.CityCount = this.rows.length;
    }, this.cityUrl);

  }

  // ------------------------------- search Function---------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.cityFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 ||
        d.country.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  // -------------------------- Delete City -----------------------------------//

  deleteCity(id) {
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
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCity/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.cityUrl);
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

  // -------------------------------- Add city Form --------------------------------//

  addCity(check, name) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
      this.cityFilter = [...this.rows];       
          this.CityCount = this.rows.length;
        }, this.cityUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ----------------------------- Edit City Form -------------------------//

  editCity(row, check, name) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.cityId = row.id; //just for edit.. to access the needed row
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
        }, this.cityUrl);
      }
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------Export as excel  file----------------------------//

  cityExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      City: row.name,
      CountryName: row.country,
      Details: row.details,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + '|' + row.createdByName

    }));

    this.service.exportAsCsvFile(filtered, 'City Location');

  }


// ---------------------------------- Export as CSV file -------------------------//

cityCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    City: row.name,
    CountryName: row.country,
    Details: row.details,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + '|' + row.createdByName

  }));

  this.service.exportAsCsvFile(filtered, 'City Location');

}




  //---------------------------- Export As Pdf --------------------------//

  cityPdfList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'City List'
      },
      content: [
        {
          text: 'City List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'City', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.details,
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


    pdfMake.createPdf(docDefinition).download('CityList.pdf');
  }

  //-------------------- Print city List --------------------------------//

  printCityList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'City List'
      },
      content: [
        {
          text: 'City List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'City', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.details,
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


    pdfMake.createPdf(docDefinition).print();
  }

  // ------------------------------- Copy City List -------------------------//
  copyCityList() {
    let count1 = this.rows.map(x => x.name.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));

    let count2 = this.rows.map(x => x.country.length);
    let max2 = count2.reduce((a, b) => Math.max(a, b));

    // let count3 = this.rows.map(x => x.details.length);
    // let max3 = count3.reduce((a, b) => Math.max(a, b));

    let count4 = this.rows.map(x => x.active.length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    // max = max + 10;
    max1 = max1 + 10;
    max2 = max2 + 10;
    // max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'City Name'.padEnd(max1) +
      'Country'.padEnd(max2) + 'Details' + 'Status'.padEnd(max4) + 'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].name.padEnd(max1) + this.rows[i].country.padEnd(max2)
        + this.rows[i].details
        + this.rows[i].active
        + this.rows[i].updatedDateTime + this.rows[i].updatedByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.CityCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}

