import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { DashboardRouting } from './dashboard-routing.module';
import { VideoComponent } from './video/video.component';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [
    DashboardComponent,
    VideoComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DashboardRouting,
    FormsModule,
    GridsterModule
  ],
  providers: [
  ]
})
export class DashboardModule { }
