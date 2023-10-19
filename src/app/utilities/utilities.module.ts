import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvmsplayerComponent } from './ivmsplayer/ivmsplayer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    IvmsplayerComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule, 
    RouterModule
  ],
  exports: [
    IvmsplayerComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ]
})
export class UtilitiesModule { }
