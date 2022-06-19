import { delay, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string) {
    return this.http.get(`assets/dados/verificarEmail.json`)
      .pipe(
        // A cada letra digitada no campo de email, está sendo feita a requisição
        // Para acabar com esse problema, basta colocar um delay, para fazer a requisição depois de alguns segundos(no caso, 2)
        delay(3000),
        map((dados: any) => dados.emails),
        // tap(console.log),
        // Como é somente 1 atributo, não tem problema declarar o tipo dele na função, porque facilita na hora do autocomplete
        map((dados: {email: string}[]) => dados.filter(v => v.email === email)),
        // tap(console.log),
        map((dados: any[]) => dados.length > 0),
        // tap(console.log)
      )
  }
}
