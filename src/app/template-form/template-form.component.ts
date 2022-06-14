import { ConsultaCepService } from './../shared/services/consulta-cep.service';
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

  onSubmit(formulario: any) {
    // Na hora de fazer o submit, quando se usa o two-way-data-binding, pode se escolher qual objeto envia
    // Esse - objeto do formulario
    //console.log(formulario.form.value);
    // Ou esse - objeto do usuario
    //console.log(this.usuario);
    console.log(formulario);
    //console.log(this.usuario);

    this.http.post(`https://httpbin.org/post`, JSON.stringify(formulario.value))
    .pipe(map(res => res))
    .subscribe(dados => {
      console.log(dados)
      // Reseta o formulario
      formulario.form.reset();
    });
  }

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

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

  consultaCEP(cep: any, form: any) {
    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
      ?.subscribe(dados => this.populaDadosForm(dados, form));
    }
  }

    populaDadosForm(dados: any, formulario: any) {
      // Com os values do nome e email, eles não são resetados, e exibem o valor já existente
      // O setValue seta todos os valores, portanto é necessário acessar até mesmo os que não se deseja alterar
      // formulario.setValue({
      //   nome: formulario.value.nome,
      //   email: formulario.value.email,
      //   endereco: {
      //     rua: dados.logradouro,
      //     cep: dados.cep,
      //     numero: '',
      //     complemento: dados.complemento,
      //     bairro: dados.bairro,
      //     cidade: dados.localidade,
      //     estado: dados.uf
      //   }
      // });
      
      // O patchValue vai setar somente os campos que forem especificados dentro dele
      formulario.form.patchValue({
        endereco: {
          rua: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf
        }
      });
      
      //console.log(form);
    }
    
    resetaDadosForm(formulario: any) {
      formulario.form.patchValue({
        endereco: {
          rua: null,
          complemento: null,
          bairro: null,
          cidade: null,
          estado: null
        }
      });
    }
  }