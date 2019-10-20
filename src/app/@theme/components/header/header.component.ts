import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatasharingService } from '../../../service/datasharing-service';
import { Engineer } from '../../../models/Engineer';
import { ApiServiceCall } from '../../../service/api-call.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  engineerList: Engineer[] = [];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private datasharingService: DatasharingService,
    private apiCall: ApiServiceCall) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.setUserProfile();
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => {
    //     if (this.datasharingService.getUserDetail() != null)
    //       this.user = users[this.datasharingService.getUserDetail().EngineerName.toLowerCase().trim()];
    //   });

    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContextItemSelection(event.item.title);
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onContextItemSelection(title) {
    console.log('click', title);
    if (title == "Log out") {
      this.datasharingService.Logout();
    }
  }

  setUserProfile() {
    let url = "api/Engineer/GetAllEngineers";
    try {
      this.apiCall.GetData(url).subscribe(data => {
        data = JSON.parse(data);
        let appData = JSON.parse(data.AppData);

        if (data.ErrorMessage != null && data.ErrorMessage != "") {

        }
        else {
          let users = {};
          
          this.engineerList = appData;
          this.engineerList.forEach(x => {
            let obj = {};
            obj["name"] = x.EngineerName;
            obj["picture"] = "assets/images/" + x.EngineerID + ".jpg";
            users[x.EngineerID] = obj;
          });
          
          if(this.datasharingService.getUserDetail() != null)
          {
            if(users.hasOwnProperty(this.datasharingService.getUserDetail().EngineerID))
            {
              this.user = users[this.datasharingService.getUserDetail().EngineerID];
            }
          }
        }
      },
        err => {
          console.log(err);
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

}
