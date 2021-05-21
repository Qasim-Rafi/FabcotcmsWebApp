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
import { ClipboardService } from 'ngx-clipboard';
import { ServiceService } from 'src/app/shared/service.service';
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
  copyData: any = [];
  temp: any = [];
  @Input() enquiryId;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private router: Router,
    private _clipboardService: ClipboardService,
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
      return (d.code.toLowerCase().indexOf(val) !== -1 ||
        d.name.toLowerCase().indexOf(val) !== -1 || !val);
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
          this.temp = [this.data]; 
          this.data = this.response.data.enquiryList;
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


  copyEnquiryList() {
    let count1 = this.rows.map(x => x.autoEnquiryNumber.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));

    let count2 = this.rows.map(x => x.enquiryDate.length);
    let max2 = count2.reduce((a, b) => Math.max(a, b));

    let count3 = this.rows.map(x => x.articleName.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));

    let count4 = this.rows.map(x => x.paymentTermName.length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    
    let count5 = this.rows.map(x => x.priceTermName.length);
    let max5 = count5.reduce((a, b) => Math.max(a, b));
    
    let count6 = this.rows.map(x => x.buyerName.length);
    let max6 = count6.reduce((a, b) => Math.max(a, b));

    max1 = max1 + 10;
    max2 = max2 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;
    max5 = max5 + 10;
    max6 = max6 + 10;


    this.copyData.push('Enquiry No.'.padEnd(max1) + 'Enquiry On.'.padEnd(max2) +
      'Customer'.padEnd(max6) + 'Article'.padEnd(max3) + 'Payment Terms'.padEnd(max4)+ 
      'Price Terms'.padEnd(max5) + 'Status \n');

    for (let i = 0; i < this.rows.length; i++) {
      let tempData =  this.rows[i].autoEnquiryNumber.padEnd(max1) 
      + this.rows[i].enquiryDate.padEnd(max2)
      + this.rows[i].buyerName.padEnd(max6)
      + this.rows[i].articleName.padEnd(max3)
      + this.rows[i].paymentTermName.padEnd(max4)
      + this.rows[i].priceTermName.padEnd(max5)
        + this.rows[i].active+ '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.listCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }
  activeEnquiryExcelFile(){
    const filtered = this.rows.map(row => ({
      EnquiryNo: row.autoEnquiryNumber,
      EnquiryOn: row.enquiryDate,
      Customer: row.buyerName,
      Article: row.articleName,
      PaymentTerms: row.paymentTermName,
      PriceTerms: row.priceTermName,
      Status: row.active == true ? "Active" : "In-Active",
    }));

    this.service.exportAsExcelFile(filtered, 'Active Enquiries');

  }
  activeEnquiryCsvFile(){
    const filtered = this.rows.map(row => ({
      EnquiryNo: row.autoEnquiryNumber,
      EnquiryOn: row.enquiryDate,
      Customer: row.buyerName,
      Article: row.articleName,
      PaymentTerms: row.paymentTermName,
      PriceTerms: row.priceTermName,
      Status: row.active == true ? "Active" : "In-Active", }));
  
    this.service.exportAsCsvFile(filtered, 'Active Enquiries');
  
  }
  printactiveEnquiryList() {

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
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }
    };

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

  }
  
}


