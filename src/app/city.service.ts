import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }
  URL="http://localhost:51381/api/Configs/GetAllCity";
  getCity(){
   let url="http://localhost:51381/api/Configs/GetAllCity/";
   return this.http.get(url);
  }
  addCity(data: any)
  {
    return this.http.post(this.URL, data)
  }
  deleteCity(id: string){
    return this.http.delete(this.URL+id)
  }
}

