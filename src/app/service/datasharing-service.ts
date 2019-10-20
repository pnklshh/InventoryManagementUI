import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Engineer } from '../models/Engineer';
import { Router } from '@angular/router';

@Injectable()
export class DatasharingService {

    public loaderSubject: Subject<Boolean> = new Subject<Boolean>();
    public userDetail: Engineer = null;

    constructor(private router: Router) { }

    showLoader() {
        this.loaderSubject.next(true);
    }
    hideLoader() {
        this.loaderSubject.next(false);
    }

    getUserDetail()
    {
        return this.userDetail;
    }
    setUserDetail(user: Engineer)
    {
        this.userDetail = user;
    }

    Logout()
    {
        this.setUserDetail(null);
        this.router.navigate(['/auth/login']);
    }
}
