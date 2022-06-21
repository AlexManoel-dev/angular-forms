import { FormArray, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit(): any;

  onSubmit() {
    if(this.formulario.valid){
      this.submit();
    } else {
      console.log('Fomulário inválido!');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    // Função recursiva - Aquela que chama a si mesma com condição, senão seria um loop infinito
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      // Com o dirty, a mensagem de erro do email não apareceu
      //controle?.markAsDirty();

      if(controle instanceof FormGroup || controle instanceof FormArray){
        this.verificaValidacoesForm(controle);
      }
    })
  }

  resetar() {
    this.formulario.reset();
  }

  // Verificando se o campo é válido ou o valor dele foi alterado, pelo component
  verificaValidTouched(campo: string) {

    // Acesso do campo desejado
    //this.formulario.controls[campo]

    // Existe também o get
    return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);
    //                 Inválido                                 Com foco                               Modificado
  }

  // Verifica se o campo foi preenchido ou não, no caso, required. E, se foi alterado ou obteve o foco
  verificaRequired(campo: string) {
    return (
      this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    )
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail?.errors) {
      // A gente consegue acessar o email dentro de errors, porque o javascript também trata arrays e objetos como dicionário(chave-valor)
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  // Aplicando css no [ngClass] por meio do componente
  aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

  getCampo(campo: string) {
    return this.formulario.get(campo);
  }
}
