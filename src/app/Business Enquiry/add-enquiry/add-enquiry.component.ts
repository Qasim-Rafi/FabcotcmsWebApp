import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddmodalComponent } from '../addbuyermodal/addmodal.component';
import { ArtienquirymodalComponent } from '../artienquirymodal/artienquirymodal.component';
import {PackagingComponent} from './packaging/packaging.component'
import { DesignTypeComponent } from './design-type/design-type.component';
import {ProcessTypeComponent} from './process-type/process-type.component';
import { ProcessenqmodalComponent } from '../processenqmodal/processenqmodal.component';
import { AddcitymodalComponent } from '../addcitymodal/addcitymodal.component';
import { AddcertmodalComponent } from '../addcertmodal/addcertmodal.component';
import { PaymentTermComponent} from './payment-term/payment-term.component'
import {PriceTermComponent} from './price-term/price-term.component'
import { ServiceService } from 'src/app/shared/service.service';
@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css']
})
export class AddEnquiryComponent implements OnInit {
  listCount:number;
    myDate=Date.now();
    response: any;
    data:any={};
    country:any=[];
    buyer:any[];
    buyerId:null;
    rows:any=[];
    temp: any=[];
    columns:any=[];
    countryId:null;
    @ViewChild(NgForm) buyerForm;
    date: number;
    
    constructor(private http:HttpClient,
              private toastr: ToastrService,  
              private modalService: NgbModal,
              private service: ServiceService
                )
               { }

             
              
  ngOnInit()
  {

    this.getenquiryCountry();
    this.getenquiryBuyers();
    return this.service.getBuyers();
    
  //   this.fetch((data) => {
  //     this.temp = [...data];
  //     this.rows = data;
  //     this.listCount = this.rows.length;
  // });


  }
  fetch(arg0: (data: any) => void) {
    throw new Error('Method not implemented.');
  }
 
  fetch1(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/Configs/GetAllArticle`)
    .subscribe(res => {
      this.response = res;
     
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

 //fetch for process function
 fetch2(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/TextileGarments/GetAllProcess`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch2.length;
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
//fetch for city modal
fetch3(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/Configs/GetAllCity`)
  .subscribe(res => {
    this.response = res;
   
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

//fetch for certificate modal

fetch4(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/TextileGarments/GetAllCertificate`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch4.length;
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

fetch5(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/Products/GetAllPriceTerm`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch5.length;
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

fetch6(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/Products/GetAllPaymentTerm`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch6.length;
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

fetch7(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/TextileGarments/GetAllProcessType`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch7.length;
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

fetch8(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/TextileGarments/GetAllDesignType`)
  .subscribe(res => {
    this.response = res;
    this.listCount = this.fetch8.length;
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
fetch9(cb) {
  let that = this;
  that.http
  .get(`${environment.apiUrl}/api/Products/GetAllPacking`)
  .subscribe(res => {
    this.response = res;
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
  getenquiryCountry()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.country =this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }
      });
  }

  addenquiryCertificateForm(){
    const modalRef = this.modalService.open(AddcertmodalComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch4((data) => {
            this.rows = data;
          });
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  } 

  addenquiryCity(){
    const modalRef = this.modalService.open(AddcitymodalComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch3((data) => {
            this.rows = data;
        
          });
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  }

 
    getenquiryBuyers()
    {
      this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyers`)
      .subscribe(
        res=> { 
    
          this.response = res;
          if (this.response.success == true){
            this.buyer =this.response.data;
            this.listCount =this.buyer.length;
           
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }

 

 addenquiryBuyerForm(){
  const modalRef = this.modalService.open(AddmodalComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
         this.date = this.myDate;
         this.getenquiryBuyers();

       }
     }, (reason) => {
       // on dismiss
     });
} 

addenquiryArticleForm(){
  const modalRef = this.modalService.open(ArtienquirymodalComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch1((data) => {
          this.rows = data;
          this.listCount = this.rows.length;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
     
} 
addenquiryProcessForm(){
  const modalRef = this.modalService.open(ProcessenqmodalComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch2((data) => {
          this.rows = data;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
}
// packaging form

addPackingForm(){
  const modalRef = this.modalService.open(PackagingComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch9((data) => {
          this.rows = data;
          
  this.listCount = this.rows.length;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
} 
// design form
addDesignTypeForm(){
  const modalRef = this.modalService.open(DesignTypeComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch8((data) => {
          this.rows = data;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
}

// process type form

addProcessTypeForm(){
  const modalRef = this.modalService.open(ProcessTypeComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch7((data) => {
          this.rows = data;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
} 

// payment Term form 

addPaymentForm(){
  const modalRef = this.modalService.open(PaymentTermComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch6((data) => {
          this.rows = data;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
} 

addPriceForm(){
  const modalRef = this.modalService.open(PriceTermComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch5((data) => {
          this.rows = data;
        });
         

       }
     }, (reason) => {
       // on dismiss
     });
} 



}
