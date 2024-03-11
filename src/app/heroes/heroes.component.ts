import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Hero } from '../interfaces/hero';
import { HeroService } from '../services/hero.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loaderService.showSpinner();
    setTimeout(() => {
      this.getHeroes();
    }, 500);
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.loaderService.hideSpinner();
    });
  }

  delete(hero: Hero): void {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'No podrás revertir el borrado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.heroService.deleteHero(hero.id).subscribe({
          next: () => {
            //this.heroes = this.heroes.filter((h) => h !== hero);
            Swal.fire({
              title: 'Borrado',
              text: `${hero.name} ha sido borrado`,
              icon: 'success',
            });
            this.getHeroes();
          },
          error: (err) => {
            console.error(
              'Se ha producido un error al borrar el registro: ' + err
            );
            this.snackBar.open(
              `Error al borrar el registro: ${err}`,
              'Cerrar',
              {
                duration: 5000,
              }
            );
          },
        });
      }
    });
  }
}
