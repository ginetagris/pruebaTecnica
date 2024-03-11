import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mis héroes favoritos';

  showSpinner = false;

  constructor(private loaderService: LoaderService) {

    this.loaderService.spinner$.subscribe((data: boolean) => {
      setTimeout(() => {
        this.showSpinner = data ? data : false;
      }, 1500);
      //console.log(this.showSpinner);
    });
}

}
