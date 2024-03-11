import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LoadingComponent {

  constructor(public loaderService: LoaderService){

  }

}
