import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GeneralService } from './services/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private router: Router, private generalService: GeneralService) { }
  headerAndFooter = true;
  sideBarOpen = false; 

  ngOnInit(): void {
    this.getSavedUserInfo();
    this.isHeaderFooterDisplayable();
  }

  async getSavedUserInfo() {
    let userData = await localStorage.getItem('userData');
    try {
      if (userData) {
        this.generalService.isLogin = true;
      }
    } catch (error) {
      console.log('Ko có thông tin local của user')
    }
    finally {
      this.router.initialNavigation();
    }
  }

  isHeaderFooterDisplayable()
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {   
        // console.log(event.url)
          if(event.url.includes('dashboard')){
              this.headerAndFooter=true;
            }else{
              this.headerAndFooter=false;
            }
      }
  });
  }
  
}
