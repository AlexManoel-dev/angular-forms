import { AbstractControl, FormArray } from '@angular/forms';

// Classe que exporta as validações para todos os arquivos. E não precisa instanciar a classe pra fazer a chamada
// Basta importar
export class FormValidations {
    /**
   * 
   * @param min - Mínimo de checkboxes a serem selecionadas
   * @returns - Retorna o nulo se o número de checkboxes for igual ou maior que o mínimo. Ou required: true, caso o contrário
   */
  static requiredMinCheckBox(min = 1){
    const validator = (formArray: AbstractControl) => {
      if(formArray instanceof FormArray){
        const totalChecked = formArray.controls.map(v => v.value)
          .reduce((total: number, atual: number) => (atual ? total + atual : total), 0);
        return totalChecked >= min ? null : {required: true};
      }
      throw new Error('formArray is not an instance of FormArray');
    };
    return validator;
  }
}