import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br';
import { DropdownService } from './../shared/services/dropdown.service';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  // Variável que vai representar o formulário
  // Variável que vai representar o formulário
  formulario: FormGroup = new FormGroup({});
  estados: EstadoBr[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
    this.dropdownService.getEstadosBr()
    .subscribe(dados => this.estados = dados);
    // Criando formulário reativo
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    //   Agrupamento de campos de formulário
    //   endereco: new FormGroup({
    //    cep: new FormControl(null)
    //  })
    // });

    // Outra forma de criar formulários reativos
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });

    //[Validators.required, Validators.minLength(3), Validators.maxLength(20)]
  }

  onSubmit() {
    console.log(this.formulario.value);

    if (this.formulario.valid) {
      this.http.post(`https://httpbin.org/post`, JSON.stringify(this.formulario.value))
      .pipe(map((res) => res))
      .subscribe(dados => {
        console.log(dados);
        // Reseta o form
        //this.formulario.reset();
        //this.resetar();
        // Assim que o response tem saída no console, o formulário é limpo
      },
      // No caso de acontecer erro, o formulário não vai ser resetado
      (error: any) => alert('Erro'));
    } else {
      console.log('Fomulário inválido!');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    // Função recursiva - Aquela que chama a si mesma com condição, senão seria um loop infinito
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      // Com o dirty, a mensagem de erro do email não apareceu
      //controle?.markAsDirty();

      if(controle instanceof FormGroup){
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

  /*consultaCEP() {

    let cep = this.formulario.get('endereco.cep')?.value;

    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    // Verifica se o campo cep possui valor informado.
    if(cep != ""){
      // Expressão regular para validar o CEP.
      var validaCep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if(validaCep.test(cep)){
        // O método resetaDadosForm, vai mudar qualquer informação que esteja dentro do input e colocar a que vem do via cep(caso o usuário tenha colocado na mão e depois colocado o cep, assim chamando o serviço do viaCEP)
        this.resetaDadosForm();
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .pipe(map((dados: any) => dados))
          .subscribe(dados => this.populaDadosForm(dados));
        }
      }
    }*/

    consultaCEP() {
      let cep = this.formulario.get('endereco.cep')?.value;

      if(cep != null && cep !== '') {
        this.cepService.consultaCEP(cep)
        ?.subscribe(dados => this.populaDadosForm(dados));
      }      
    }

    populaDadosForm(dados: any) {
      this.formulario.patchValue({
        endereco: {
          rua: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf
        }
      });

      // Caso queira popular apenas um campo do seu formulário, pode-se utilizar o setValue daquele campo em específico
      this.formulario.get('nome')?.setValue('Alex')
    }

    resetaDadosForm() {
      this.formulario.patchValue({
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
