import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Dateformater } from '../../shared/dateformater';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericFilterForAllComponent } from 'src/app/shared/generic-filter-for-all/generic-filter-for-all.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-all-contract-report-accounts',
  templateUrl: './all-contract-report-accounts.component.html',
  styleUrls: ['./all-contract-report-accounts.component.css']
})
export class AllContractReportAccountsComponent implements OnInit {

  data3: any = [];
  columns: any = [];
  response: any;
  buyer: any = [];
  contractOwnera: any = [];
  status: boolean = false;
  seller: any = [];
  article: any = [];
totalContract :  any;
totalQuantity :  any;
totalDispatch :  any;
search: any = [];
screenHeight:any;
screenWidth:any;
departmentIdFromAdmin:any;
loggedInDepartmentNamecheck:any


quantityValue:any;
quantityCommission:any;

dispatchValue:any;
dispatchCommission:any;

blanceValue:any;
blanceCommission:any;
blance:any;



department:any=[];

@HostListener('window:resize', ['$event'])
onResize(event?) {
   this.screenHeight = window.innerHeight;
   this.screenWidth = window.innerWidth;
}
@ViewChild(NgForm) filterForm;
dateformater: Dateformater = new Dateformater();
  allContractReport :  any = []
  loggedInDepartmentName :  any;
  constructor(   private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    private router: Router,) {
      this.onResize(); 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-collapse'); 
    // let footer = document.getElementsByTagName('footer')[0];
    // footer.classList.add('d-none'); 
    
    // let zoom = document.getElementById('zoom').style.minHeight =this.screenWidth;
  }
     

  ngOnInit(): void {
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.loggedInDepartmentNamecheck=localStorage.getItem('departName');
    this.GetDeparmentDropdown();
    this.getAllContractReport();
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
  }
  GetDeparmentDropdown() {
    this.service.getDepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        // this.response.data.splice(1, 1);
        // this.response.data.splice(9, 1);
        this.department = this.response.data;
        this.data3.departmentId = 3
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellersDropdown() {
    this.service.getSellers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  // getContractOwnersDropdown(){
  //   this.http
  //   .get(`${environment.apiUrl}/api/Lookups/GetOwners`)
  //   .subscribe(res => {
  //     this.response = res;
     
  //   if(this.response.success==true)
  //   {
  //   this.contractOwnera=this.response.data;

  //   }
  //   else{
  //     this.toastr.error(this.response.message, 'Message.');
  //   }
  //   }, err => {
  //     if ( err.status == 400) {
  // this.toastr.error(err.error.message, 'Message.');
  //     }
  //   });
  // }
  Search(event) {
    if(event.target.value == 65){
      const temp =  this.search.filter(x=>x.age > "65")
      this.allContractReport = temp;
    }
    else{
      const val = event.target.value.toLowerCase();
      const temp = this.search.filter(function (d) {
        return (d.contractNo.toLowerCase().indexOf(val) !== -1 
        || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
        d.status.toLowerCase().indexOf(val) !==-1   ||
        // d.age.toLowerCase().indexOf(val) !==-1   ||
        !val);
      });
      this.allContractReport = temp;
    }

  }
  clearfunction(){
    this.filterForm.reset();
  }
  departchange(){
    this.getAllContractReport()
  }
  getAllContractReport(){
    this.spinner.show();
    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
      "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
      "status" : "All",
      "AdminDepartmentId" :this.data3.departmentId != undefined  ?this.data3.departmentId :3
    }
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.allContractReport = this.response.data.obj;
  
   console.log(this.allContractReport)
       
            
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity
            this.search = [...this.allContractReport]

            this.quantityValue=0;
            this.quantityCommission=0;
            this.dispatchValue=0;
            this.dispatchCommission=0;
            this.blance=0;
            this.blanceValue=0;
            this.blanceCommission=0;
            this.spinner.hide();
            for(let i=0;i<=this.allContractReport.length; i++){
              if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                this.blance += parseFloat(this.allContractReport[i].balanceQty);
              }
                
              if(parseFloat(this.allContractReport[i].booking) != undefined && parseFloat(this.allContractReport[i].rate) !=undefined && parseFloat(this.allContractReport[i].sellerCommission) != undefined){
                if(this.loggedInDepartmentNamecheck == "Yarn Local" || this.loggedInDepartmentNamecheck == "Yarn Local Karachi"){
 
                 this.quantityValue += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * 10;
                 this.quantityCommission += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
                     
                 this.dispatchValue += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * 10;
                 this.dispatchCommission += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
                
                  if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                 this.blanceValue += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * 10;
                 this.blanceCommission += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
                  }
                }
                else {
                 this.quantityValue +=  parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate);
                 this.quantityCommission += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) /100;
 
                 this.dispatchValue += parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate);
                 this.dispatchCommission += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) /100;
 
                 if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                   this.blanceValue +=parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate);
                   this.blanceCommission += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) /100;
                    }
 
 
                }
               }
              //  else{

                }

          





        
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  getAllContractReportfilter(p){
    this.spinner.show();
    // let varr = {
    //   "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    //   "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    //   "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    //   "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
    //   "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    //   "status" : "All",
    //   "AdminDepartmentId" :this.departmentIdFromAdmin
    // }
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, p)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.allContractReport = this.response.data.obj;
  

       
            
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity
            this.search = [...this.allContractReport]
            this.quantityValue=0;
            this.quantityCommission=0;
            this.dispatchValue=0;
            this.dispatchCommission=0;
            this.blance=0;
            this.blanceValue=0;
            this.blanceCommission=0;
            this.spinner.hide();
            for(let i=0;i<=this.allContractReport.length; i++){
              if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                this.blance += parseFloat(this.allContractReport[i].balanceQty);
              }
                
              if(parseFloat(this.allContractReport[i].booking) != undefined && parseFloat(this.allContractReport[i].rate) !=undefined && parseFloat(this.allContractReport[i].sellerCommission) != undefined){
               if(this.loggedInDepartmentNamecheck == "Yarn Local" || this.loggedInDepartmentNamecheck == "Yarn Local Karachi"){

                this.quantityValue += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * 10;
                this.quantityCommission += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
                    
                this.dispatchValue += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * 10;
                this.dispatchCommission += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
               
                 if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                this.blanceValue += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * 10;
                this.blanceCommission += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission) * 10 /100;
                 }
               }
               else {
                this.quantityValue +=  (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * 10;
                this.quantityCommission += (parseFloat(this.allContractReport[i].booking) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission);

                this.dispatchValue += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * 10;
                this.dispatchCommission += (parseFloat(this.allContractReport[i].dispatch) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission);

                if(parseFloat(this.allContractReport[i].balanceQty) != 0){
                  this.blanceValue +=(parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * 10;
                  this.blanceCommission += (parseFloat(this.allContractReport[i].balanceQty) * parseFloat(this.allContractReport[i].rate)) * parseFloat(this.allContractReport[i].sellerCommission);
                   }


               }
              }
              //  else{

                }
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.contractId} });
  };


  filterPopUformGenericAll(menu) {
    const modalRef = this.modalService.open(GenericFilterForAllComponent, { centered: true,size:"lg" });
    modalRef.componentInstance.menu = menu;
    modalRef.componentInstance.departId = this.data3.departmentId;
    modalRef.result.then((p) => {
      if (p != null) {
   this.getAllContractReportfilter(p)

      }
    }, (reason) => {
    });
  }

  resetfilter(name){
    this.getAllContractReport();
  }

  allContractExcelFile(){
    const filtered = this.allContractReport.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate + row.rateUOMName ,
     
  
      Quantity: row.balanceQty,
      QtyUOM:row.uomName,
      Booking: row.booking ,
      
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,
      Cost: row.cost ,
      SellerComm: row.sellerCommission ,
      SellerCommAmount: row.sellerCommissionAmount ,
      BuyerComm: row.buyerCommission ,
      BuyerCommAmount: row.buyerCommissionAmount ,
      PaymentTermSellerBuyer : row.paymentTerm ,
      Status :row.status,
      Agent : row.agent ,

      

    }));

    this.service.exportAsExcelFile(filtered, 'All Contract Report');

  }

  allContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'Landscape',
      info: {
        title: 'All Contract List'
      },
      content: [
        {
          text: 'All Contract List',
          style: 'heading',

        },
        {
          margin: [-30 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [23, 35, 45, 45 , 30 , 23 , 40 , 25 , 30 , 35 , 37 , 35 , 30, 35 , 40 , 40 , 40, 40 
            ],
            body:[
              [
                {text:'Age' , style:'tableHeader' }
              ,{text:'Contract#' , style:'tableHeader'} ,
              {text:'Buyer' , style:'tableHeader' }, 
              {text:'Seller' , style:'tableHeader' }, 

              {text:'Date'  , style:'tableHeader'} , 
              {text:'PO#' , style:'tableHeader'} , 
              {text:'Article' , style:'tableHeader'},
              
              {text:'Rate'  , style:'tableHeader'} , 
              {text:'Qty Unit' , style:'tableHeader'} , 
              {text:'Booking' , style:'tableHeader'},
              {text:'Dispatch'  , style:'tableHeader'} , 
              {text:'Balance' , style:'tableHeader'} , 
              {text:'Cost' , style:'tableHeader'},
              {text:'Seller Comm'  , style:'tableHeader'} , 
              {text:'Seller Comm Amount'  , style:'tableHeader'} , 
            
              {text:'Payment Term S|B'  , style:'tableHeader'} , 
              {text:'Status'  , style:'tableHeader'} , 
              {text:'Agent' , style:'tableHeader'} , 

            ],
              ...this.allContractReport.map(row => (
                [
                  {text: row.age , style:'tableHeader2'} ,
                {text:  row.contractNo , style:'tableHeader2'},
                {text: row.buyerName, style:'tableHeader2'} ,
                {text: row.sellerName , style:'tableHeader2'} ,
                 {text: row.date, style:'tableHeader2'} ,
                  {text:row.poNumber  , style:'tableHeader2' }  ,
                  {text: row.articleName , style:'tableHeader2'},
           
                 {text: row.rate + "/" + row.rateUOMName, style:'tableHeader2'} ,
                  {text:row.quantityUOMName  , style:'tableHeader2' }  ,
                  {text: row.booking + " " + row.quantityUOMName , style:'tableHeader2'},
              
                   {text:row.dispatch + " " + row.quantityUOMName   , style:'tableHeader2' }  ,
                   {text:row.balanceQty + " " + row.quantityUOMName   , style:'tableHeader2' }  ,
                   {text: row.rateCurrencyName == 'PKR' ? "Rs." + row.cost : row.rateCurrencyName == 'USD' ? "$ " + row.cost : row.rateCurrencyName == 'EUR' ? "€ " + row.cost : row.rateCurrencyName == 'GBP' ? "GBP " + row.cost : row.cost, style:'tableHeader2'} ,
                   {text:row.sellerCommission != "" ? row.sellerCommission + "%" : ""   , style:'tableHeader2' }  ,
                   {text:   row.sellerCommissionAmount != '' ?   row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.sellerCommissionAmount + "]" :  row.sellerCommissionAmount  : row.sellerCommissionAmount , style:'tableHeader2'} ,

                   //{text:row.buyerCommission != "" ? row.buyerCommission + "%" : ""   , style:'tableHeader2' }  ,
                   //{text: row.buyerCommissionAmount != '' ?  row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.buyerCommissionAmount + "]" :  row.buyerCommissionAmount  :  row.buyerCommissionAmount  , style:'tableHeader2'} ,

                  //  {text:   row.sellerCommission != "" ? row.sellerCommission + "%" +    row.rateCurrencyName == 'PKR' ? "Rs." + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP "+ "["  + row.sellerCommissionAmount + "]": row.cost : row.sellerCommission , style:'tableHeader2' }  ,
                  //  {text:   row.buyerCommission != "" ? row.buyerCommission + "%" +    row.rateCurrencyName == 'PKR' ? "Rs." + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP "+ "["  + row.buyerCommissionAmount + "]": row.cost : row.buyerCommission , style:'tableHeader2' } 
                   
                   
                   {text: row.paymentTerm , style:'tableHeader2'},
                   {text: row.status , style:'tableHeader2'},
                   {text: row.agent , style:'tableHeader2'},


                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }

  clickEvent(){
    this.status = !this.status;
}

}
