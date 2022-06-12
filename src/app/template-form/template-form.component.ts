import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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

}
