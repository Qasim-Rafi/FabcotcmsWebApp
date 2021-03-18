import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {
  data:any={};
  response: any;
 
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  
  get activeModal() {
    return this._NgbActiveModal;
  }




  
  addFabricType()
  {
    let varr=  {
      "type": this.data.type,
      "description": this.data.description,
      "active": this.data.active,
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Products/AddFabricType`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(true);
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



}
