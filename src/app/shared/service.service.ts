import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  response:any;
  country:any=[];
  buyer:any=[];
  article:any=[];
  constructor(private http: HttpClient, private toastr: ToastrService,) { }

  getCountry()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)

  }
  
  getBuyers()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`);
  }
getArticles()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Articles`)
  }
  getPaymentTerm()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PaymentTerms`)
  }
  getPackaging()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Packagings`)
  }
  
  getDesignType()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/DesignTypes`)
  }
  getProcess()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Process`)
  }
  getProcessType()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/ProcessTypes`)
  }
  getCertification()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/Certifications`)

  }
  getPriceTerm()
  {
    return this.http.get(`${environment.apiUrl}/api/Lookups/PriceTerms`)

  }
  getCity()
  {
    return this.http.get(`${environment.apiUrl}
    ​/api/Lookups/Destinations`)
  }
}
