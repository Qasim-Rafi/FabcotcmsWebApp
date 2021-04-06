import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { EditBankAccountComponent } from './edit-bank-account/edit-bank-account.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {

  listCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  temp: any[]; s

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal,) { }

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
      return (d.accountName.toLowerCase().indexOf(val) !== -1 ||
      d.accountNumber.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }



  fetch(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Configs/GetAllBankAccount`)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.listCount = this.response.data.length;
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




  deleteAccount(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.accountName +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteBankAccount/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });

              }
              else {
                this.toastr.error('Something went Worng', 'Message.');
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


  addAccountForm() {
    const modalRef = this.modalService.open(AddBankAccountComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.fetch((data) => {
          this.rows = data;

        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editAccountForm(row) {
    const modalRef = this.modalService.open(EditBankAccountComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.fetch((data) => {
          this.rows = data;

        });

      }
    }, (reason) => {
      // on dismiss
    });
  }

// excecl///////////
  
exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    AccountName :row.accountName,
    AccountNo :row.accountNumber,
    IBAN :row.iban,
    SwiftCode :row.swiftCode,
    AccountType :row.type,
     Bank:row.bankName ,
     Branch:row.branchName 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Bank Account');
  
  }

// Pdf /////////////////

  generatePDF() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Bank Account List'
      },
      content: [
        {
          text: 'Bank Account List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 60, 60, 60, 60 , 60 , 60  , 50 , 50],
            body: [
              ['S.no.', 'Account Name', 'Account No.', 'IBAN', 'Swift Code' , 'Account Type' , 'Bank Name' , 'Branch Name' ],
              ...this.data.map(row => (
                [row.id, row.accountName, row.accountNumber, row.iban, 
                  row.swiftCode,row.type , 
                  row.bankName, row.branchName] 
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


    pdfMake.createPdf(docDefinition).download('BankAccount.pdf');
  }
// print 
printPdf() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Bank Account List'
    },
    content: [
      {
        text: 'Bank Account List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 60, 60, 60, 60 , 60 , 60  , 50 , 50],
          body: [
            ['S.no.', 'Account Name', 'Account No.', 'IBAN', 'Swift Code' , 'Account Type' , 'Bank Name' , 'Branch Name' ],
            ...this.data.map(row => (
              [row.id, row.accountName, row.accountNumber, row.iban, 
                row.swiftCode,row.type , 
                row.bankName, row.branchName] 
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


