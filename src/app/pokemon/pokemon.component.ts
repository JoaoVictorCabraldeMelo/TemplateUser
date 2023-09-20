import { Component, OnInit } from '@angular/core';
import { DataService, PokemonResponse } from '../data.service';
import { ToastService } from '../toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Pokemon } from '../data.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {

  pokemons: Pokemon[] = [];

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
  ) { }
  
  ngOnInit() {
    this.dataService.getPokemons()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showToast(error.error.message, error.status.toString());
          return throwError(error);
        })
    )
    .subscribe((data: PokemonResponse) => {
      this.pokemons = data.results;
      data.results.forEach((pokemon: Pokemon) => {
        this.dataService.getPokemon(pokemon.url)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.toastService.showToast(error.error.message, error.status.toString());
              return throwError(error); 
            })
          )
          .subscribe((data: any) => {
            pokemon.image = data.sprites.front_default;
          });
      });
    });
  }
}
