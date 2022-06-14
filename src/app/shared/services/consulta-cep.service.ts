import { map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string) {

    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    // Verifica se o campo cep possui valor informado.
    if(cep != ""){
      // Expressão regular para validar o CEP.
      var validaCep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
        if(validaCep.test(cep)){
          return this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .pipe(map(dados => dados))
        }
      }
      // O tipo do consulta cep, retorna um observable, ou um undefined. Colocando o undefined como retorno o erro para
      // Mas não deve ser o correto a se fazer
      return of({}); // Forma de sempre estar retornando algo, mesmo se o cep seja válido ou não
      // O método só terá retorno se cair no if, mas caso não cair não fará nada, por isso o erro.
      // Portanto, quando se encontrar nesse caso, somente coloque um return vazio, e quando não passar no if ele não faz nada
    }
}
