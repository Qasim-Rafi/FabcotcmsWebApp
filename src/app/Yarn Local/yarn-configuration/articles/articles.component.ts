import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddArticleComponent } from './add-article/add-article.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})

export class ArticlesComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  copyData: any = [];
  data: any = {};
  articleCount: number;
  articleFilter: any = [];
  articleUrl = '/api/Configs/GetAllArticle'
  inActiveRecord: any = [];
  activeRecord: any = [];

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {

    
    this.service.fetch((data) => {
      this.rows = data;
      this.articleFilter = [...this.rows];

      this.articleCount = this.rows.length
    }, this.articleUrl);


  }

  // ----------------------- Search Function ---------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.articleFilter.filter(function (d) {
      return (
        d.code.toLowerCase().indexOf(val) !== -1 ||
        d.name.toLowerCase().indexOf(val) !== -1 ||
        d.genericName.toLowerCase().indexOf(val) !== -1 || 
        !val);
    });
    this.rows = temp;
  }

  activeInactive(event){
    if(event.target.value == "InActive"){
     this.inActiveRecord = this.articleFilter.filter(x=>x.active == false); 
      this.rows =this.inActiveRecord 
    }
    else if(event.target.value == "Active"){
     this.activeRecord = this.articleFilter.filter(x=>x.active == true); 
      this.rows =this.activeRecord; 
    }
   }
 

  // ------------------------- Delete Article Form ------------------//

  deleteArticle(id) {

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
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteArticle/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
      this.articleFilter = [...this.rows];

this.spinner.hide();
                }, this.articleUrl);

              }
              else {
                this.toastr.error(this.response.message, 'Message.');
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

  // ------------------------------ Add Article Form p-------------------------//

  addArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
     


      }
      this.service.fetch((data) => {
        this.rows = data;
    this.articleFilter = [...this.rows];

        this.articleCount = this.rows.length;
      }, this.articleUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------- Edit Article Form ----------------------------//

  editArticleForm(row) {
    const modalRef = this.modalService.open(EditArticleComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.articleFilter = [...this.rows];
  
        }, this.articleUrl);

      }
     
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------Export as excel File ----------------------------//

  articleExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      ArticleCode: row.code,
      ArticleName: row.name,
      GenericName: row.genericName,
      Status: row.active == true ? "Active" : "In-Active",
      LastUpdateOn: row.updatedDateTime,
      LastUpdateBy: row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Article');

  }

 // --------------------------Export as CSV File ----------------------------//

 articleCsvFile() {

  const filtered = this.rows.map(row => ({
    SNo: row.id,
    ArticleCode: row.code,
    ArticleName: row.name,
    GenericName: row.genericName,
    Status: row.active == true ? "Active" : "In-Active",
    LastUpdateOn: row.updatedDateTime,
    LastUpdateBy: row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'Article');

}


  // -------------------------------Export as  pdf ---------------------------------//

  articlePdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Article List'
      },
      content: [
        {
          text: 'Articles List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 50, 80, 80, 40, 100, 70],
            body: [
              ['S.no.', 'Article Code', 'Article Name', 'Generic Name', 'Status', 'Last Update On', 'Last Update By'],
              ...this.rows.map(row => (
                [row.id, row.code, row.name, row.genericName, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime, row.updatedByName
                ]
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


    pdfMake.createPdf(docDefinition).download('ArticleList.pdf');
  }

  //------------------------------------ print Article List ----------------------//

  printArticleList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Article List'
      },
      content: [
        {
          text: 'Articles List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 50, 80, 80, 40, 100, 70],
            body: [
              ['S.no.', 'Article Code', 'Article Name', 'Generic Name', 'Status', 'Last Update On', 'Last Update By'],
              ...this.rows.map(row => (
                [row.id, row.code, row.name, row.genericName, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime, row.updatedByName
                ]
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

  copyArticleList() {
   this.copyData.push('S. No.'.padEnd(10) + 'Article Code '.padEnd(10) +
      'Article Name'.padEnd(10) + 'Generic Name'.padEnd(10)+'Status'.padEnd(10)+  'Last Updated On'.padEnd(10) + 'Last Updated By \n');

    for (let i = 0; i < this.rows.length; i++) {
      let tempData =  this.rows[i].id
        +''.padEnd(5)
      + this.rows[i].code
      +''.padEnd(5)
      + this.rows[i].name
      +''.padEnd(5)
      + this.rows[i].genericName
      +''.padEnd(5)
      + this.rows[i].active
      +''.padEnd(5)
      + this.rows[i].updatedDateTime
      +''.padEnd(5)
      + this.rows[i].createdByName+
       '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.articleCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}
