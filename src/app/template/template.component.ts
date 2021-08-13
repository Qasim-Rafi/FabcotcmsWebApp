import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPopUpComponent } from '../shared/reports/filter-pop-up/filter-pop-up.component';

// import * as $ from 'jquery';
// import * as AdminLte from 'admin-lte';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  title = 'Project';
  userName:string;
  loggedInDepartmentId: string;
  loggedInDepartmentName: string;
  isYarnLocal:boolean;
  isHomeTextileandGarments:boolean;
  isFabricLocal:boolean;
  userrole:string;
  Contract: boolean = false;
  Billing: boolean = false;
  Config: boolean = false;
  Report: boolean = false;
  Departments: boolean = false;
  menuName:any={};
  response: any;
  openContractReport: any = [];
  agentBookingStatus: any = [];
  cancleContarctReport: any = [];
  billingReportInvoiceWise: any = [];
  dispatchReport: any = [];
  billingReportContractWise: any = [];
  taxChallanReport: any = [];
  commissionReport: any = [];
  dbcrNoteSummary: any = [];
  externalAgentReport: any = [];
  kickbackReport: any = [];
  allContractReport: any = [];
  paymentReport:any=[];
  lCReport:any=[];
  Product: boolean = false;
  Bank: boolean = false;
  Enqurie: boolean = false;
  Textile: boolean = false;
  constructor( private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,


    ) { }

  ngOnInit(): void {

    this.userrole=localStorage.getItem('role');
    this.loggedInDepartmentId=localStorage.getItem('loggedInDepartmentId');
    this.userName=localStorage.getItem('loggedInUserName');
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    
    if(this.loggedInDepartmentId == '1'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '2'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '3'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
     this.isFabricLocal=false;
  }
  else if(this.loggedInDepartmentId == '4'){
    this.isYarnLocal = true;
    this.isHomeTextileandGarments= false;
this.isFabricLocal=false;
  }   else if(this.loggedInDepartmentId == '5'){
    this.isYarnLocal = false;
    this.isHomeTextileandGarments= false;
this.isFabricLocal=true;
  }
  else if(this.loggedInDepartmentId == '6'){
    this.isYarnLocal = false;
    this.isHomeTextileandGarments= true;
this.isFabricLocal=false;
  } 
    else if(this.loggedInDepartmentId == '7'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '8'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '9'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
   
  //   $('li.dropdown.mega-dropdown a').on('click', function (event) {
  //     $(this).parent().toggleClass("open");
  // });
  
  // $('body').on('click', function (e) {
  //     if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
  //         $('li.dropdown.mega-dropdown').removeClass('open');
  //     }
  // });
  }
  alert(){
    // Swal.fire({
    //   title: '<strong>Sign-Out Confirmation</strong>',
    //   html:
    //     '<br>Hi,<b>Ali</b>!'+ '<br>'+
    //   '<p style="float: left;">Do you want to logout your session?Kindly confirm</p>',
    //   showCancelButton: true,
    //   confirmButtonColor: "grey",
    //   cancelButtonColor:"#1ab394",
    //   focusConfirm: false,
    //   // TextColor:,
    //   cancelButtonText:
    //   '<a href="login" (click)="logout()" style="color:white">Yes Log me out</a>' ,
    //   confirmButtonText:
    //   ' <a href="home" style="color:white">I am not sure</a>',
    // })
// this.name =localStorage.getItem()

     
Swal.fire({
  title: 'Do you want to logout your session?Kindly confirm',

  showCancelButton: true,
  confirmButtonText: `Yes Log me out`,
 
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
 localStorage.clear();
 localStorage.removeItem('token');
 this.router.navigate(['']);
//  location.reload();
  } else if (result.isDenied) {
    
  }
})
  }
  reportsRoughtMethod(menuName){
    this.router.navigate(['/reports'], { queryParams: { menuName: menuName } });
    this.GetReportData();
    if(menuName == "CommissionReport"){
      // localStorage.removetem('lc');
      // localStorage.setItem('comm', "CommissionReport");
    this.filterPopUform("CommissionReport");
    }
    else  if(menuName == "LCReport"){
      // localStorage.removetem('comm');
      // localStorage.setItem('lc', "LCReport");
      this.filterPopUform("LCReport");
      }
  }
  // ngAfterViewInit() {
  //   $('[data-widget="treeview"]').each(function() {
  //       AdminLte.Treeview._jQueryInterface.call($(this), 'init');
  //   });
  // }
  menuOpen(menuName){
    if(menuName == 'Contract'){
      this.Contract = !this.Contract;       
    }
    else if(menuName == 'Billing'){
       this.Billing =!this.Billing;
    }
    else if(menuName == 'Config'){
      this.Config =!this.Config;
   }
   else if(menuName == 'Product'){
    this.Product =!this.Product;
 }
 else if(menuName == 'Bank'){
  this.Bank =!this.Bank;
}
else if(menuName == 'Enqurie'){
  this.Enqurie =!this.Enqurie;
}
else if(menuName == 'Textile'){
  this.Textile =!this.Textile;
}
else if(menuName == 'Report'){
  this.Report =!this.Report;
  
}
else if(menuName == 'Departments'){
  this.Departments =!this.Departments;
  this.Report =!this.Report;
}
}


GetReportData() {
  this.spinner.show();
  this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContract`)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.menuName = this.route.snapshot.queryParams;
          if(this.menuName.menuName == 'OpenContractReport'){
            this.openContractReport = this.response.data;
          }
          else if(this.menuName.menuName == 'AllContractReport'){
            this.allContractReport = this.response.data;
          }
          else if(this.menuName.menuName == 'AgentBookingStatus'){
            this.agentBookingStatus = this.response.data;
          }
          else if(this.menuName.menuName == 'CancleContarctReport'){
            this.cancleContarctReport = this.response.data;
          }
          else if(this.menuName.menuName == 'BillingReportInvoiceWise'){
            this.billingReportInvoiceWise = this.response.data;
          }
          else if(this.menuName.menuName == 'DispatchReport'){
            this.dispatchReport = this.response.data;
          }
          else if(this.menuName.menuName == 'BillingReportContractWise'){
            this.billingReportContractWise = this.response.data;
          }
          else if(this.menuName.menuName == 'PaymentReport'){
            this.paymentReport = this.response.data;
          }
          else if(this.menuName.menuName == 'TaxChallanReport'){
            this.taxChallanReport = this.response.data;
          }
          else if(this.menuName.menuName == 'CommissionReport'){
            this.commissionReport = this.response.data;
            localStorage.removeItem('newName');
            localStorage.removetem('lc');


          }
          else if(this.menuName.menuName == 'DbcrNoteSummary'){
            this.dbcrNoteSummary = this.response.data;
          }
          else if(this.menuName.menuName == 'ExternalAgentReport'){
            this.externalAgentReport = this.response.data;
          }
          else if(this.menuName.menuName == 'LCReport'){
            this.lCReport = this.response.data;
            localStorage.removetem('comm');
          }
          else if(this.menuName.menuName == 'KickbackReport'){
            this.kickbackReport = this.response.data;
          }
          //this.data = this.response.data;
          this.spinner.hide();
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
      this.spinner.hide();

}
filterPopUform(menu) {
  const modalRef = this.modalService.open(FilterPopUpComponent, { centered: true });
  modalRef.componentInstance.menu = menu;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {


    }
  }, (reason) => {
    // on dismiss
  });
}

navigate(){
  this.router.navigate(['/filter'])
}

}
