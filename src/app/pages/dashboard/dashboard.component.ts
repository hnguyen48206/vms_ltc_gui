import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem }  from 'angular-gridster2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  
  constructor() {   
  }

  // public open(evt, link) {
  //   evt.preventDefault();
  //   window.nw.Shell.openExternal(link.url);
  // }

  // public openDevTools(evt) {
  //   evt.preventDefault();
  //   window.nw.Window.get().showDevTools();
  // }

  itemChange(item, itemComponent) {
    console.info('itemChanged', item, itemComponent);
  }

  itemResize(item, itemComponent) {
    console.info('itemResized', item, itemComponent);
  }

  ngOnInit() {
    this.options = {
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize,
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2}
    ];
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

 
}
