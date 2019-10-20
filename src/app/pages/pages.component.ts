import { Component, OnInit } from '@angular/core';
import { DatasharingService } from '../service/datasharing-service';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet><div [class.page-loader]='showLoader'></div></router-outlet>
    <ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit{

  menu = MENU_ITEMS;

  public showLoader:boolean = false;

  constructor(private datasharingService: DatasharingService) {
  }

  ngOnInit(): void {

    this.datasharingService.loaderSubject.subscribe((value: boolean) => {
      this.showLoader = value;
    });

    if(this.datasharingService.getUserDetail() != null && this.datasharingService.getUserDetail().Role != "admin")
    {
      this.menu.find(x => x.title == "Database Management").children.find(c => c.title == "Add Engineer").hidden = true;
      this.menu.find(x => x.title == "Stock Management").children.find(c => c.title == "Add Stock").hidden = true;
      this.menu.find(x => x.title == "Allocation Management").children.find(c => c.title == "Allocate Item").hidden = true;
      this.menu.find(x => x.title == "Report Management").children.find(c => c.title == "Report Usage").hidden = true;   
    }
  }
}
