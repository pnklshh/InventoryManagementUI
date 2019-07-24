import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DatasharingService {

    public loaderSubject: Subject<Boolean> = new Subject<Boolean>();
    
    constructor() { }

    showLoader() {
        this.loaderSubject.next(true);
    }
    hideLoader() {
        this.loaderSubject.next(false);
    }

}
