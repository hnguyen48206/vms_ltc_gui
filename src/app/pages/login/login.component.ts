import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private generalService: GeneralService) { }

  ngOnInit(): void {
  }
  async login()
  {
    await localStorage.setItem('userData', JSON.stringify({}));
    this.generalService.isLogin=true;
    this.router.navigate(['/home']);
  }
}
