import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  data:any;
  search:any;
  response:any;
  constructor(private _NgbActiveModal: NgbActiveModal,
    private service:ServiceService,
    private toaster:ToastrService) { }

  ngOnInit(): void  {
    this.service.getDocumentType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.search = this.response.data;
      }
      else {
        this.toaster.error(this.response.message, 'Message.');
      }
    })
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

}
