import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EnquiryItemsComponent } from 'src/app/shared/MODLES/enquiry-items/enquiry-items.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-active-enquiry',
  templateUrl: './active-enquiry.component.html',
  styleUrls: ['./active-enquiry.component.css']
})
export class ActiveEnquiryComponent implements OnInit {
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  myDate = Date.now();
  temp: any = [];
  @Input() enquiryId;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    // private service: ServiceService,
  ) { }


  navigateAddEnquiry() {
    this.router.navigateByUrl('/enquiry/enquiries');
  };


  navigateEditEnquiry(obj) {
    this.router.navigate(['/enquiry/edit-active-enquiries'], { queryParams: {id: obj.id} });
  };


  ngOnInit(): void {

    // this.editEnquiry(this.enquiryId);
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });

  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.autoEnquiryNumber.toLowerCase().indexOf(val) !== -1 ||
              d.buyerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }



  fetch(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiry`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.response.data.enquiryList.length;

        if (this.response.success == true) {
          this.data = this.response.data.enquiryList;
          this.temp = [this.data];
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


  copyRecord(value){

    this.http
      .put(`${environment.apiUrl}/api/Enquiries/CloneEnquiry/`+value.id,{})
      .subscribe(res => {
        this.response = res;
        // this.listCount = this.response.data.length;

        if (this.response.success == true) {
          this.fetch((data) => {
            this.rows = data;
          });
      
     
    
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





  deleteEnquiry(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.autoEnquiryNumber + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiry/` + obj.id)
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
  cloneEnquiry(obj){

    let varr = {
  
      "enquiryId": obj.id,
      "autoEnquiryNumber":obj.autoEnquiryNumber,
      "enquiryDate": obj.enquiryDate,
      "buyerName": obj.buyerName,
      "articleName" : obj.articleName,
      "paymentTermName":obj.paymentTermName,
      "priceTermName":obj.priceTermName
    
    }
     this.http.put(`${environment.apiUrl}/api/Enquiries/CloneEnquiry/`+obj.id , varr )
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.data = this.response.data;
                this.temp = [this.data];
              this.toastr.success(this.response.message, 'Message.');
              this.fetch((data) => {
                this.rows = data;
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
  
  
  }
  enquiryPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Active Enquiry List'
      },
      content: [
        {
          text: 'Active Enquiry List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [60, 80, 60, 50, 80 , 60,40],
            body: [
              ['Inquiry No.', 'Inquiry On', 'Customer', 'Article', 'Payment Terms' ,'Price Term' , 'Status'],
              ...this.rows.map(row => (
                [row.autoEnquiryNumber, row.enquiryDate, row.buyerName,row.articleName ,
                  row.paymentTermName , row.priceTermName,
                row.active == true ? "Active" : "In-Active"]
              ))
            ]
           
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }

    };


    pdfMake.createPdf(docDefinition).download('ActiveEnquiry.pdf');
  }


}
