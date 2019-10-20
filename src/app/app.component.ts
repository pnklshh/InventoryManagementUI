/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { DatasharingService } from '../app/service/datasharing-service';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-app',
  template: "<router-outlet><div [class.page-loader]='showLoader'></div></router-outlet>",
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private datasharingService: DatasharingService) {
  }

  public showLoader:boolean = false;

  ngOnInit(): void {
    this.analytics.trackPageViews();

    this.datasharingService.loaderSubject.subscribe((value: boolean) => {
      this.showLoader = value;
    });

  }

}
