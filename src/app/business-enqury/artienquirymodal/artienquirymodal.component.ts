import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-artienquirymodal',
  templateUrl: './artienquirymodal.component.html',
  styleUrls: ['./artienquirymodal.component.css']
})
export class ArtienquirymodalComponent implements OnInit {
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





  addArticle()
  {
    let varr=  {
      "code": this.data.code,
      "name": this.data.name,
      "genericName": this.data.genericName,
      "description": this.data.description
    }

    this.http.
    post(`${environment.apiUrl}/api/Configs/AddArticle`,varr)
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
