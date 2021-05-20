import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddArticleComponent } from './add-article/add-article.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
  data: any = {};
  articleCount: number;
  articleFilter: any = [];
  articleUrl = '/api/Configs/GetAllArticle'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {

    
    this.service.fetch((data) => {
      this.articleFilter = [...data];
      this.rows = data;
      this.articleCount = this.rows.length
    }, this.articleUrl);


  }

  // ----------------------- Search Function ---------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.articleFilter.filter(function (d) {
      return (d.code.toLowerCase().indexOf(val) !== -1 ||
        d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteArticle/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;

                }, this.articleUrl);

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

  // ------------------------------ Add Article Form p-------------------------//

  addArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.articleCount = this.rows.length;
        }, this.articleUrl);


      }
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


}
