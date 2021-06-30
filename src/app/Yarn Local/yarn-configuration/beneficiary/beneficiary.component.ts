import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddEditComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})
export class BeneficiaryComponent implements OnInit {

  
  BeneficiaryCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = [];
  copyData: any = [];
  beneficiaryDate = Date.now();
  beneficiaryFilter: any = [];
  beneficiaryUrl = '/api/Configs/GetAllBeneficiary'

  @ViewChild('myTable') table: DatatableComponent;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private _clipboardService: ClipboardService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    // Temporary.............
    this.service.fetch((data) => {
      this.rows = data;
      this.beneficiaryFilter = [...this.rows];

      this.BeneficiaryCount = this.rows.length;
    }, this.beneficiaryUrl);

  }

  // ------------------------------- search Function---------------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.beneficiaryFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 ||
        d.country.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

 
 

  // -------------------------------- Add beneficiary Form --------------------------------//

  addBeneficiary(check, name) {
    const modalRef = this.modalService.open(AddEditComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
 


      }
      this.service.fetch((data) => {
        this.rows = data;
    this.beneficiaryFilter = [...this.rows];       
        this.BeneficiaryCount = this.rows.length;
      }, this.beneficiaryUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  // ----------------------------- Edit Beneficiary Form -------------------------//

  editBeneficiary(row, check, name) {
    const modalRef = this.modalService.open(AddEditComponent, { centered: true });
    modalRef.componentInstance.beneficiaryId = row.id; //just for edit.. to access the needed row
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
      
      }
      this.service.fetch((data) => {
        this.rows = data;
      }, this.beneficiaryUrl);
    }, (reason) => {
      // on dismiss
    });
  }
  // reviveBeneficiary(row, check, name) {
  //   const modalRef = this.modalService.open(AddEditComponent, { centered: true });
  //   modalRef.componentInstance.beneficiaryId = row.id; //just for edit.. to access the needed row
  //   modalRef.componentInstance.statusCheck = check;
  //   modalRef.componentInstance.FormName = name;

  //   modalRef.result.then((data) => {
  //     // on close
  //     if (data == true) {
      
  //     }
  //     this.service.fetch((data) => {
  //       this.rows = data;
  //     }, this.beneficiaryUrl);
  //   }, (reason) => {
  //     // on dismiss
  //   });
  // }
 
  deleteBeneficiary(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + 'Beneficiary of User:' + '"' + row.userName + '"',
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
  
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteBeneficiary/` + row.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.beneficiaryFilter = [...this.rows];
            
                  this.BeneficiaryCount = this.rows.length;
                }, this.beneficiaryUrl);
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
              }
  
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });
  
      }
    })
  
  }

  beneficiaryExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      Beneficiary: row.name,
      CountryName: row.country,
      Details: row.details,
      Status: row.status == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + '|' + row.createdByName

    }));

    this.service.exportAsCsvFile(filtered, 'Beneficiary Location');

  }


// ---------------------------------- Export as CSV file -------------------------//

beneficiaryCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    Beneficiary: row.name,
    CountryName: row.country,
    Details: row.details,
    Status: row.status == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + '|' + row.createdByName

  }));

  this.service.exportAsCsvFile(filtered, 'Beneficiary Location');

}




  //---------------------------- Export As Pdf --------------------------//

  beneficiaryPdfList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Beneficiary List'
      },
      content: [
        {
          text: 'Beneficiary List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Beneficiary', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.details,
                row.status == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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


    pdfMake.createPdf(docDefinition).download('BeneficiaryList.pdf');
  }

  //-------------------- Print beneficiary List --------------------------------//

  printBeneficiaryList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Beneficiary List'
      },
      content: [
        {
          text: 'Beneficiary List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90, 130, 50, 150],
            body: [
              ['S.no.', 'Beneficiary', 'Details', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.details,
                row.status == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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

  // ------------------------------- Copy Beneficiary List -------------------------//
  copyBeneficiaryList() {
    let count1 = this.rows.map(x => x.name.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));

    let count2 = this.rows.map(x => x.country.length);
    let max2 = count2.reduce((a, b) => Math.max(a, b));

    // let count3 = this.rows.map(x => x.details.length);
    // let max3 = count3.reduce((a, b) => Math.max(a, b));

    let count4 = this.rows.map(x => x.status.length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    // max = max + 10;
    max1 = max1 + 10;
    max2 = max2 + 10;
    // max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'Beneficiary Name'.padEnd(max1) +
      'Country'.padEnd(max2) + 'Details' + 'Status'.padEnd(max4) + 'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].name.padEnd(max1) + this.rows[i].country.padEnd(max2)
        + this.rows[i].details
        + this.rows[i].status
        + this.rows[i].updatedDateTime + this.rows[i].updatedByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Status".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.BeneficiaryCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}

