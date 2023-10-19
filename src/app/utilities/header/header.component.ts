import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  ngOnInit() { }  

  logout()
  {
    this.generalService.logout();
  }

}
