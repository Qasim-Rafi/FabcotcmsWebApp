import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router){}
  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      const token = localStorage.getItem('token');
      // if (localStorage.getItem('userToken') != null)
      // return true;
      // this.router.navigate(['/login']);
      // return false;
      if (token !== null) {
        const decodedToken: any = jwt_decode(token);
  
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired, navigate to login or another route
          this.router.navigate(['']);
          return false;
        }
  
        return true;
      } else {
        this.router.navigate(['']); // User is not authenticated, navigate to login or another route
        return false;
      }
  }
}
