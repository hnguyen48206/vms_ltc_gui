import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  isLogin = false;
  userData
  constructor(private router: Router) { }

  logout()
  {
    this.isLogin=false;
    localStorage.removeItem('userData');
    this.router.navigate(['/home'], {queryParams: {clearHistory: true }});
  }

  checkIfUserHasRightToThisRoute(routeToCheck)
  {
    console.log(routeToCheck)
    return true;
  }
  
}
