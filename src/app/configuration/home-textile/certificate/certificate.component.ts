import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
// import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  response:any;
  rows:any=[];
  columns:any=[];
  data:any={};
  listCount: number;
  myDate=Date.now();
  temp: any=[];


  constructor(private http:HttpClient,
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
      return d.name.toLowerCase().indexOf(val) !== -1  || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  fetch(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/TextileGarments/GetAllCertificate`)
    .subscribe(res => {
      this.response = res;
      this.listCount = this.rows.length;
    if(this.response.success==true)
    {
    that.data =this.response.data;
    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');;
      }
    //  this.spinner.hide();
    });
  }

  

  deleteCertificate(id){
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
    
        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteCertificate/`+id.id )
        .subscribe(
          res=> { 
            this.response = res;
            if (this.response.success == true){
             this.toastr.error(this.response.message, 'Message.');
             this.fetch((data) => {
              this.rows = data;
              this.listCount = this.rows.length;
            });
              
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
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


  addCertificateForm(check){
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
       modalRef.componentInstance.statusCheck =check;
      //  modalRef.componentInstance.name =componentName;

          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
            this.listCount = this.rows.length;
          });
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  editCertificateForm(row,check){
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.Id =row.id; //just for edit.. to access the needed row
    modalRef.componentInstance.statusCheck = check;
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
          });
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  // excel ///
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    CertificateName :row.name,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Certificate');
  
  }
// pdf ///

generatePDF() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Certificate List'
    },
    content: [
      {
        text: 'Certificate List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 80, 80, 50, 170 ],
          body: [
            ['S.no.', 'Certificate Name', 'Details', 'Status', 'Update Date Time | Updated By' ],
            ...this.data.map(row => (
              [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
              row.updatedDateTime + '|' + row.updatedByName 
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


  pdfMake.createPdf(docDefinition).download('Certificate.pdf');
}

// print 
printPdf() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Certificate List'
    },
    content: [
      {
        text: 'Certificate List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 80, 80, 50, 170 ],
          body: [
            ['S.no.', 'Certificate Name', 'Details', 'Status', 'Update Date Time | Updated By' ],
            ...this.data.map(row => (
              [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
              row.updatedDateTime + '|' + row.updatedByName 
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

