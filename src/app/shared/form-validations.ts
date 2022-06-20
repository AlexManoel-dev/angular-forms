import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// Classe que exporta as validações para todos os arquivos. E não precisa instanciar a classe pra fazer a chamada
// Basta importar
export class FormValidations {
    /**
   * 
   * @param min - Mínimo de checkboxes a serem selecionadas
   * @returns - Retorna o nulo se o número de checkboxes for igual ou maior que o mínimo. Ou required: true, caso o contrário
   */
  static requiredMinCheckBox(min = 1){
    // Aqui a gente recebe o parâmetro extra, e depois o controle
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

  static cepValidator(control: FormControl) {
    // Aqui a gente recebe o controle direto

    const cep = control.value;
    if (cep && cep !== '') {
      const validaCep = /^[0-9]{8}$/;
      return validaCep.test(cep) ? null : { cepInvalido: true };
    }
    // Caso for válido, retorna null
    return null;
  }

  // Mesma estratégia do método que possui um parâmetro extra
  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {
      if(otherField == null) {
        throw new Error('É necessário informar um campo.');
      }
      // O Angular vai executar a validação assim que o campo for renderizado na tela, e pode ser que no momento que a gente renderize o campo, o formulário ainda não esteja pronto
      // Validação que evita esse erro
      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }
      const field = (<FormGroup>formControl.root).get(otherField);
      if(!field) {
        throw new Error('É necessário informar um campo válido.');
      }
      if(field.value !== formControl.value) {
        return { equalsTo: otherField };
      }
      // Caso for igual, retorna null para dizer que o campo está válido
      return null;
    }
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
    const config: { [id: string]: string } = {
      'required': `${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      // Não precisa ser erros somente do Angular, é possível colocar os erros customizados
      'cepInvalido': 'CEP inválido.',
      'emailInvalido': 'O e-mail informado já está cadastrado!',
      'equalsTo': 'Os campos precisam ser iguais.',
      'pattern': 'Campo inválido.'
    };
    // Conferir último comentário do vídeo
    return config[validatorName];
  }
}