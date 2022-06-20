import { FormValidations } from './../form-validations';
import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss']
})
export class ErrorMsgComponent implements OnInit {

  // @Input() mostrarErro: boolean | undefined = false;
  // @Input() msgErro: string = '';

  @Input() control: FormControl = new FormControl();
  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  // Como é uma propriedade get(deixa de ser um método), ela não vai ter o método set, portanto não conseguiremos atribuir um valor a essa propriedade. Mas podemos obter o valor
  // Esse valor vai ser calculado em tempo de uso no nosso template
  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if(this.control.errors.hasOwnProperty(propertyName) && 
        this.control.touched){
          return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
