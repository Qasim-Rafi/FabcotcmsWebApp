import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-contracts',
  templateUrl: './active-contracts.component.html',
  styleUrls: ['./active-contracts.component.css']
})
export class ActiveContractsComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  navigate() {

    this.router.navigateByUrl('/active-contract-details');
  }


}
