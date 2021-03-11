import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PackagingComponent} from './packaging/packaging.component'
import { DesignTypeComponent } from './design-type/design-type.component';
import {ProcessTypeComponent} from './process-type/process-type.component';
import { ProcessenqmodalComponent } from '../processenqmodal/processenqmodal.component';
import { AddcitymodalComponent } from '../addcitymodal/addcitymodal.component';
import { AddcertmodalComponent } from '../addcertmodal/addcertmodal.component';
import { PaymentTermComponent} from './payment-term/payment-term.component'
import {PriceTermComponent} from './price-term/price-term.component'
import { ServiceService } from 'src/app/shared/service.service';
import { AddmodalComponent } from '../addmodal/addmodal.component';
import { AddArticleComponent } from 'src/app/configuration/articles/add-article/add-article.component';
@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css']
})
export class AddEnquiryComponent implements OnInit {
  listCount:number;
    myDate=Date.now();
    response: any; data:any={}; country:any=[]; buyer:any[]; designId:null; packageId:null; article:any=[]; articleId:null;
    type:any[]; package:any[]; buyerId:null; city:any[]; certificateId:any[]; paymentId:any[]; term:any[]; priceId:any[];
    processId:null; cityId:any[]; rows:any=[]; temp: any=[]; columns:any=[]; countryId:null; processtypeId:null;
    @ViewChild(NgForm) buyerForm;
    date: number;
  payment: any=[]; packaging: any=[]; design: any=[]; process: any={}; ptype: any={}; certification: any={}; priceterm: any={};
    city1: any=[]; country1: any=[];
  
    constructor(private http:HttpClient,
              private toastr: ToastrService,  
              private modalService: NgbModal,
              private service: ServiceService
                )
               { }           
  ngOnInit()
  {
    
    {
      this.service.getCountry().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.country1 = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
{
  this.service.getBuyers().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.data = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getArticles().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.article = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getPaymentTerm().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.payment = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getPackaging().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.packaging = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getDesignType().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.design = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}

{
  this.service.getProcess().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.process = this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getProcessType().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.ptype= this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getCertification().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.certification= this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}
{
  this.service.getPriceTerm().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.priceterm= this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}



{
  this.service.getCity().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.city1= this.response.data;
    }
    else {
      this.toastr.error('Something went Worng', 'Message.');
    }
  })
}


    this.getenquiryCountry();
    this.getenquiryBuyers();
 







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
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');;
      }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');;
    }
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
  const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
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
