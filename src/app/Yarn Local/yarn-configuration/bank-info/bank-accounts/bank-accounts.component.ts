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
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {

  bankAccCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  copyData: any = [];
  data: any = {};
  bankAccFilter: any[];
  bankAccUrl = '/api/Configs/GetAllBankAccount'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.bankAccFilter = [...this.rows];

      this.bankAccCount = this.rows.length
    }, this.bankAccUrl);
  }
//  ----------------------- Search Function ---------------//
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.bankAccFilter.filter(function (d) {
      return (d.accountName.toLowerCase().indexOf(val) !== -1 ||
        d.accountNumber.toLowerCase().indexOf(val) !== -1 || !val);
    });

    this.rows = temp;

  }

//  --------------------- Delete Bank Account ----------------------///

  deleteAccount(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.accountName + '"',
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
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteBankAccount/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                }, this.bankAccUrl);
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

// -------------------------- add Bankk Acount Form -----------------------------//

  addAccountForm() {
    const modalRef = this.modalService.open(AddBankAccountComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       


      }
      this.service.fetch((data) => {
        this.rows = data;
        this.bankAccFilter = [...this.rows];
        this.bankAccCount = this.rows.length

      }, this.bankAccUrl);
    }, (reason) => {
      // on dismiss
    });
  }

// -------------------------------- Edit Bank Account Form ---------------------------------//

  editAccountForm(row) {
    const modalRef = this.modalService.open(EditBankAccountComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       

      }
      this.service.fetch((data) => {
        this.rows = data;

      }, this.bankAccUrl);
    }, (reason) => {
      // on dismiss
    });
  }

// ------------------------- Export As Excel file ---------------------------//

  bankAccExcelFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.id,
      AccountName: row.accountName,
      AccountNo: row.accountNumber,
      IBAN: row.iban,
      SwiftCode: row.swiftCode,
      AccountType: row.type,
      Bank: row.bankName,
      Branch: row.branchName
    }));

    this.service.exportAsExcelFile(filtered, 'Bank Account');

  }


// ------------------------- Export As CSV file ---------------------------//

bankAccCsvFile(){
  const filtered = this.rows.map(row => ({
    SNo: row.id,
    AccountName: row.accountName,
    AccountNo: row.accountNumber,
    IBAN: row.iban,
    SwiftCode: row.swiftCode,
    AccountType: row.type,
    Bank: row.bankName,
    Branch: row.branchName
  }));

  this.service.exportAsCsvFile(filtered, 'Bank Account');

}

// --------------------------- Export As Pdf File ---------------------------------//

  bankAccPdf() {

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
            widths: [30, 60, 60, 60, 60, 60, 60, 50, 50],
            body: [
              ['S.no.', 'Account Name', 'Account No.', 'IBAN', 'Swift Code',
                'Account Type', 'Bank Name', 'Branch Name'],
              ...this.rows.map(row => (
                [row.id, row.accountName, row.accountNumber, row.iban,
                row.swiftCode, row.type,
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

  //----------------------- print Bank Account List ---------------------------------//

  printBankAccList() {

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
            widths: [30, 60, 60, 60, 60, 60, 60, 50, 50],
            body: [
              ['S.no.', 'Account Name', 'Account No.', 'IBAN', 'Swift Code', 'Account Type', 'Bank Name', 'Branch Name'],
              ...this.rows.map(row => (
                [row.id, row.accountName, row.accountNumber, row.iban,
                row.swiftCode, row.type,
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
  copyBankAccountList() {
    this.copyData.push('S. No.'.padEnd(10) + 'Account Name'.padEnd(10) +
    'Account Number'.padEnd(10)+'IBAN'.padEnd(10)+ 'Swift Code'.padEnd(10)+ 'Account Type'.padEnd(10)+ 'Bank'.padEnd(10) + 'Branch \n');
  
  for (let i = 0; i < this.rows.length; i++) {
    let tempData =  this.rows[i].id
      +''.padEnd(5)
    + this.rows[i].accountName
    +''.padEnd(5)
    + this.rows[i].accountNumber
    +''.padEnd(5)
    + this.rows[i].iban
    +''.padEnd(5)
    + this.rows[i].swiftCode
    +''.padEnd(5)
    + this.rows[i].type
    +''.padEnd(5)
    + this.rows[i].bankName
    +''.padEnd(5)
    + this.rows[i].branchName
    +'\n';
    this.copyData.push(tempData);
  }
  this._clipboardService.copy(this.copyData)
  
  Swal.fire({
    title: GlobalConstants.copySuccess,
    footer: 'Copied' + '\n' + this.bankAccCount + '\n' + 'row/s to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
  }
  
}


