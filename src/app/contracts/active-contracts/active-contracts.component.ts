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

    this.router.navigateByUrl('/contract/active-contract-details');
  }


activeContract(){
  console.log("Active Contracts");
  // document.getElementById('all').style. = 'background-color: red; color: white;';
}

openContract(){
  console.log("open Contracts");
  // document.getElementById('open').style.cssText = 'background-color: red; color: white;';
}


bill_awaitedContract(){
  console.log("bill_awaited Contracts")
}

billedContract(){
  console.log("billed Contracts")
}

receivableContract(){
  console.log("receivable Contracts")
}

receivedContract(){
  console.log("received Contracts")
}

on_HandContract(){
  console.log("on_Hand Contracts")
}









}
