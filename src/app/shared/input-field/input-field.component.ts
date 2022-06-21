import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  // PARA CADA CAMPO DE INPUT PODEMOS TER APENAS 1 NG_VALUE_ACCESSOR
  // No caso, nesse campo customizado, eu não poderia usar nenhuma diretiva de nenhuma biblioteca da internet que já tenha implementado o NG_VALUE_ACCESSOR
  // Portanto, teria que ser feita uma implementação do zero, ou utilizar apenas a diretiva, diretamente no formulário
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
};

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() classeCss: any;
  @Input() id: string = '';
  @Input() label: string = 'ASDUFAISUYDGF';
  // A tipagem nesse caso não é obrigatória, pois como a variável está recebendo uma string, automaticamente o typescript tipa ela
  @Input() type = 'text';
  @Input() control: any;
  @Input() isReadOnly = false;

  // Valor que vai ser usado somente no escopo dessa classe
  private innerValue: any;

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    // Se o valor for o mesmo, não tem porquê disparar o evento de que o valor mudou
    if(v ! == this.innerValue){
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  onChangeCb: (_: any) => void  = () => {};
  onTouchedCb: (_: any) => void  = () => {};

  writeValue(v: any): void {
    this.value = v;
  }
  
  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }
}
