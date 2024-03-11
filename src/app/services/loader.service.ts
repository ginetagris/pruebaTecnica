import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // private loading: boolean = false;

  // constructor() { }

  // setLoading(loading: boolean) {
  //   this.loading = loading;
  // }

  // getLoading(): boolean {
  //   return this.loading;
  // }

  public spinner$: Subject<any>;

  constructor() {
    this.spinner$ = new Subject<any>();
  }

  showSpinner() {
    this.spinner$.next(true);
  }

  hideSpinner() {
    this.spinner$.next(false);
  }
}
