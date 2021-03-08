import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CityDetail } from './city-detail.model'
@Injectable({
  providedIn: 'root'
})
export class CityDetailService {
  formData: CityDetail= new CityDetail();
  readonly baseURL = 'http://localhost:51381';
  list : CityDetail[];
  constructor(private http: HttpClient) { }
}
