import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.css']
})
export class AddBankComponent implements OnInit {

  response:any;
  data:any={};

  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

    
  get activeModal() {
    return this._NgbActiveModal;
  }

  
  addBank()
  {
    let varr=  {
      "name": this.data.name,
      "branchCode":this.data.branchCode,
      "branchName":this.data.branchName ,
      "location":this.data.location,
      "address":this.data.address,
      "details":this.data.details,
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Configs/AddBank`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(true);
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



}
