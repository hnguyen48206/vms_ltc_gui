import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/services/route-guard.service";
import { DashboardComponent } from "./dashboard.component";
import { VideoComponent } from "./video/video.component";

const routes: Routes = [   
    {
      path: '',
      data: { "link":"/dashboard"},
      component: DashboardComponent,
    },
    {
      canActivate:[RouteGuardService],
      path: 'video',
      data: { "link":"/dashboard/video"},
      component: VideoComponent,
    }
  ];
  
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class DashboardRouting { }