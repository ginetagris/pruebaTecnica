import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../interfaces/hero';
import { HeroService } from '../services/hero.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  heroes: Hero[] = [];

  heroForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(300)],
    ],
  });

  idActual: number = 0;
  showSpinner = false;
  formNew: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar
  ) {
    this.loaderService.spinner$.subscribe((data: boolean) => {
      setTimeout(() => {
        this.showSpinner = data ? data : false;
      });
      //console.log(this.showSpinner);
    });
  }

  ngOnInit(): void {
    this.loaderService.showSpinner();
    setTimeout(() => {
      this.getHero();
    }, 500);
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

    if (!Number.isNaN(id)) {
      this.formNew = false;
      this.heroService.getHero(id).subscribe((hero) => {
        let { name, description, id } = hero;
        name = name.toUpperCase();
        this.heroForm.setValue({ name, description });
        this.idActual = id;
      });
    } else {
      this.formNew = true;
    }
    this.loaderService.hideSpinner();
  }

  goBack(): void {
    this.location.back();
  }

  add(): void {
    // name = name.trim();
    // if (!name || !description) { return; }

    const { name, description } = this.heroForm.value;
    this.heroService.addHero({ name, description } as Hero).subscribe({
      next: (hero) => {
        this.heroes.push(hero);
        Swal.fire({
          icon: 'success',
          title: 'Añadido',
          text: `${hero.name}`,
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Se ha producido un error al añadir el registro: ' + err);
        this.snackBar.open(`Error al añadir el registro: ${err}`, 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  save(): void {
    console.log(this.heroForm.value);

    const { name, description } = this.heroForm.value;

    const data: Hero = {
      id: this.idActual,
      name: name ? name : '',
      description: description ? description : '',
    };

    if (this.heroForm.value) {
      this.heroService.updateHero(data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: `${data.name}`,
          });
          this.goBack();
        },
        error: (err) => {
          console.error(
            'Se ha producido un error al guardar el registro: ' + err
          );
          this.snackBar.open(`Error al guardar el registro: ${err}`, 'Cerrar', {
            duration: 5000,
          });
        },
      });
    }
  }

  delete(): void {
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
        this.heroService.deleteHero(this.idActual).subscribe({
          next: () => {
            //this.heroes = this.heroes.filter((h) => h !== hero);
            Swal.fire({
              title: 'Borrado',
              text: `${this.heroForm.value.name} ha sido borrado`,
              icon: 'success',
            });
            this.goBack();
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

  get name() {
    return this.heroForm.controls['name'];
  }

  get description() {
    return this.heroForm.controls['description'];
  }
}
