import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBankComponent } from './add-bank/add-bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})

export class BankComponent implements OnInit {

  bankCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  myDate = Date.now();
  bankFilter: any[];
  bankUrl = '/api/Configs/GetAllBank'
 
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.bankFilter = [...data];
      this.rows = data;
    } , this.bankUrl);

  }
// ----------------- Search Function ------------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.bankFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 ||
      d.branchName.toLowerCase().indexOf(val) !== -1 || !val);
    });

    this.rows = temp;
   
  }

// ----------------------- Delete Bank -----------------------//

  deleteBank(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.name +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteBank/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                } , this.bankUrl);

              }
              else {
                this.toastr.error('Something went Worng', 'Message.');
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });

      }
    })

  }

  // ---------------------------- Add Bank Form ---------------------//

  addBankForm() {
    const modalRef = this.modalService.open(AddBankComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.bankFilter = [...data];
          this.rows = data;
          this.bankCount = this.rows.length;
        } , this.bankUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

// ---------------------------------- Edit Bank Form ----------------------//

  editEditForm(row) {
    const modalRef = this.modalService.open(EditBankComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        
        this.service.fetch((data) => {
          this.rows = data;

        } , this.bankUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }

// -------------------------- Export As Excel file -----------------------//

  bankExcelFile(): void {
    const filtered = this.rows.map(row => ({
      SNo:row.id,
    BankName :row.name,
    BranchCode :row.branchCode,
    BranchName :row.branchName,
    Location :row.location,
    Address :row.address,
     Details:row.details 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Bank');
  
  }

  // ---------------------------- Export as PDF ----------------------------//
  bankPdf() {
   
        let docDefinition = {
          pageSize: 'A4',
          info: {
            title: 'Bank List'
          },
          content: [
            {
              text: 'Bank List',
              style: 'heading',
    
            },
    
            {
              layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                widths: [30, 70, 70, 70, 50 , 60 , 60 ],
                body: [
                  ['S.no.', 'Bank Name', 'Branch Code', 'Branch Name', 'Location' , 'Address' , 'Details'],
                  ...this.rows.map(row => (
                    [row.id, row.name, row.branchCode, row.branchName, 
                      row.location,row.address , 
                      row.details] 
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
        pdfMake.createPdf(docDefinition).download('BankList.pdf');
      }
    
// ------------------------ print bank list ------------------------------//

printBankList() {
   
  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Bank List'
    },
    content: [
      {
        text: 'Bank List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 70, 70, 70, 50 , 60 , 60 ],
          body: [
            ['S.no.', 'Bank Name', 'Branch Code', 'Branch Name', 'Location' , 'Address' , 'Details'],
            ...this.rows.map(row => (
              [row.id, row.name, row.branchCode, row.branchName, 
                row.location,row.address , 
                row.details] 
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

