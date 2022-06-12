import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  };

  onSubmit(form: any) {
    // Na hora de fazer o submit, quando se usa o two-way-data-binding, pode se escolher qual objeto envia
    // Esse - objeto do form
    //console.log(form.form.value);
    // Ou esse - objeto do usuario
    //console.log(this.usuario);
    console.log(form);
    //console.log(this.usuario);
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  // Verificando se o campo é válido ou o valor dele foi alterado, pelo component
  verificaValidTouched(campo: any) {
    return !campo.valid && campo.touched;
  }

  // Aplicando css no [ngClass] por meio do componente
  aplicaCssErro(campo: any) {
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

  consultaCEP(cep: any) {
    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    // Verifica se o campo cep possui valor informado.
    if(cep != ""){
      // Expressão regular para validar o CEP.
      var validaCep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if(validaCep.test(cep)){
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .pipe(map((dados: any) => dados))
          .subscribe(dados => console.log(dados));
        }
      }
    }
  }