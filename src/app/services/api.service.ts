import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {
  apiLists = {
    verifyotp: '/api/auth/verify-otp',
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }

  constructor(private httpClient: HttpClient, private router: Router, private generalService: GeneralService) {
  }
  defaultTimeout = 10000
  httpCall(url, header, body, method) {
    if (this.generalService.userData != null) {
      header['Authorization'] = 'Bearer ' + this.generalService.userData.token;
    }
    return new Promise((resolve, reject) => {
      //use angular http        
      if (method == 'get') {
        this.httpClient.get(url, { headers: header })
          .pipe(
            timeout(this.defaultTimeout),
            catchError(e => {
              return Promise.reject('TimeOut');;
            })
          )
          .subscribe(res => {
            let result = <any>res;
            console.log(result);
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
      else if (method == 'post') {
        this.httpClient.post(url, body, { headers: header })
          .pipe(
            timeout(this.defaultTimeout),
            catchError(e => {
              return Promise.reject('TimeOut');;
            })
          )
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
      else if (method == 'patch') {
        this.httpClient.patch(url, body, { headers: header })
          .pipe(
            timeout(this.defaultTimeout),
            catchError(e => {
              return Promise.reject('TimeOut');;
            })
          )
          .subscribe(res => {
            console.log(res);
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
      else if (method == 'put') {
        this.httpClient.put(url, body, { headers: header })
          .pipe(
            timeout(this.defaultTimeout),
            catchError(e => {
              return Promise.reject('TimeOut');;
            })
          )
          .subscribe(res => {
            console.log(res);
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
      else if (method == 'delete') {
        this.httpClient.delete(url, { headers: header })
          .pipe(
            timeout(this.defaultTimeout),
            catchError(e => {
              return Promise.reject('TimeOut');;
            })
          )
          .subscribe(res => {
            console.log(res);
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
    });
  }


}
