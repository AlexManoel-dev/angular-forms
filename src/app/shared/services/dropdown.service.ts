import { Cidade } from './../models/cidade.model';
import { EstadoBr } from './../models/estado-br';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr() {
    return this.http.get<EstadoBr[]>(`assets/dados/estadosbr.json`)
    .pipe(map((res => res)))
  }
  
  getCidades(idEstado: number) {
    return this.http.get<Cidade[]>(`assets/dados/cidades.json`)
    .pipe(map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado)));
  }

  getCargos() {
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr' }
    ];
  }

  getTecnologias() {
    return [
      { nome: 'java', desc: 'Java' },
      { nome: 'javascript', desc: 'Javascript' },
      { nome: 'php', desc: 'PHP' },
      { nome: 'ruby', desc: 'Ruby' }
    ];
  }
  
  getNewsletter() {
    return [
      { id: 1, valor: 's', desc: 'Sim' },
      { id: 0, valor: 'n', desc: 'Não' }
    ];
  }
}
