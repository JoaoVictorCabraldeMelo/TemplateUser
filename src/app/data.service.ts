import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  _id: string,
  title: string,
  description: string | undefined | null,
  userId: string,
  createdAt: string,
  updatedAt: string
  deletedAt: string | undefined | null
}

export interface Pokemon {
  name: string,
  url: string,
  image?: string
}

export interface PokemonResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: Pokemon[]
} 

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  login(formData: any) : Observable<any>  {
    return this.http.post(this.url + 'auth/login', formData);
  }

  createTask(taskData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromLocalStorage()}`
    });

    return this.http.post(this.url + 'tasks', taskData, { headers });
  }

  getTasks(userId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromLocalStorage()}`,
    });

    return this.http.get<Task[]>(this.url + `tasks/all/${userId}`, { headers });
  }

  getPokemons() {
    return this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
  }

  getPokemon(url: string) {
    return this.http.get<Pokemon>(url);
  }

  private getTokenFromLocalStorage() {
    const token = localStorage.getItem('token');
    return token ? token : '';
  }
}
