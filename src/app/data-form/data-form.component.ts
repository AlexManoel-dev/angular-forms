import { Cidade } from './../shared/models/cidade.model';
import { BaseFormComponent } from './../shared/base-form/base-form.component';
import { VerificaEmailService } from './services/verifica-email.service';
import { EstadoBr } from './../shared/models/estado-br';
import { Cargo } from '../shared/models/cargo.model';
import { Tecnologia } from '../shared/models/tecnologia.model';
import { Newsletter } from '../shared/models/newsletter.model';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { DropdownService } from './../shared/services/dropdown.service';
import { distinctUntilChanged, EMPTY, empty, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidations } from '../shared/form-validations';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // Variável que vai representar o formulário
  // Variável que vai representar o formulário
  // formulario: FormGroup = new FormGroup({});
  estados: EstadoBr[] = [];
  cidades: Cidade[] = [];
  // Foi comentado, pois não é necessário fazer 2 subscribes em um mesmo observable, portanto, a variável não precisa ser um observable de estados
  // estados: Observable<EstadoBr[]> = new Observable<EstadoBr[]>();
  cargos: Cargo[] = [];
  tecnologias: Tecnologia[] = [];
  newsletterOp: Newsletter[] = [];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) { 
    super();
  }

  override ngOnInit(): void {
    // this.verificaEmailService.verificarEmail('email@email.com').subscribe();
    // Dar prioridade para usar o pipe async, quando utilizar informações que estão vindo de observables no template

    // this.estados = this.dropdownService.getEstadosBr(); // O pipe async, usado no ngFor no html, faz o subscribe automaticamente
    // FAZENDO O SUBSCRIBE SEM O PIPE ASYNC - PARA NÃO TER DUPLA CHAMADA DE SUBSCRIBE
    this.dropdownService.getEstadosBr()
      .subscribe(dados => this.estados = dados);

    // Mesmo com a destruição do componente, a inscrição pode ficar ativa. Ocorrendo o vazamento de memória "memory licks"
    // this.dropdownService.getEstadosBr()
    // .subscribe(dados => this.estados = dados);
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();
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
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      // Primeiro, o valor inicial. Segundo, validações síncronas. Terceiro, validações assíncronas
      // Se for só uma validação, funciona sem os colchetes, já se for mais de uma, é necessário. E sim, da pra fazer o uso de mais de uma validação por campo
      // O Angular ficou perdido com relação ao escopo, para esse erro não acontecer, basta associar o escopo da validação desse campo com o próprio componente
      // Usando o .bind(this)
      // Isso acaba com o problema de escopo
      // Outra forma de acabar com esse problema, seria reescrevendo a validação, para que ela recebesse o serviço como parâmetro, e então não precisaria fazer o bind
      // Caso não passar o serviço como parâmetro, é necessário o uso do bind
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      // Essa validação vai cobrir as outras, portanto só ela já basta
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        // Como não está sendo passado nenhum parâmetro extra, não é preciso passar uma função e sim só a validação
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'], // Valor padrão
      // O pattern é usado para poder validar uma expressão regular
      termos: [null, Validators.pattern('true')], // Forma mais simples de validar um campo do tipo toggle, porque ele precisa ser true para validar
      // Já aqui, é necessário passar a função
      frameworks: this.buildFrameworks()
    });

    // Pode funcionar em qualquer nível. Tanto do formulário, do FormGroup, do FormArray e FormControl - Obserav a mudança de status do nível em específico, a cada mudança de status do formulário
    // STATUS - VALID, INVALID, PENDING e DISABLED
    // this.formulario.statusChanges

    // Valor do form que vai ser enviado
    // this.formulario.value;
    
    // É feito para capturar cada mudança de valor do formulário
    // this.formulario.valueChanges;

    // FORMA DE CONSULTAR O CEP DE MANEIRA MAIS REATIVA, UTILIZANDO PROGRAMAÇÃO FUNCIONAL E REATIVA
    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        // Não exibe todas as alterações, só exibe quando a alteração é aplicada para um valor diferente
        distinctUntilChanged(),
        tap(value => console.log('status CEP: ', value)),
        // Pode ser executada uma lógica, mas é preciso retornar um Observable
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value)
          : EMPTY
        )
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {});
      // Estava dentro do subscribe {
        // if (status === 'VALID') {
        //   this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value)
        //   ?.subscribe(dados => this.populaDadosForm(dados))
        // }
      // }

      this.formulario.get('endereco.estado')?.valueChanges
        .pipe(
          tap(estado => console.log('Novo estado: ', estado)),
          map(estado => this.estados.filter(e => e.sigla === estado)),
          map((estados: any) => estados && estados.length > 0 ? estados[0].id : EMPTY),
          switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
          tap(console.log)
        )
        .subscribe(cidades => this.cidades = cidades);

      // FORMA DE VERIFICAR SE OS DADOS ESTÃO CHEGANDO CORRETAMENTE
      // this.dropdownService.getCidades(8).subscribe(console.log);

    //[Validators.required, Validators.minLength(3), Validators.maxLength(20)]
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckBox(1));
    // Em cima, está sendo feito o mesmo código, porém de forma dinâmica
    // this.formBuilder.array( [
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false)
    // ]);
  }

  // requiredMinCheckbox(min = 1) {
  //   const validator = (formArray: FormArray) => {
  //     // const values = formArray.controls;
  //     // let totalChecked = 0;
  //     // for (let i = 0; i < values.length; i++) {
  //     //   if (values[i].value) {
  //     //     totalChecked += 1;
  //     //   }
  //     // }
  //     // Programação funcional
  //     const totalChecked = formArray.controls
  //       .map(v => v.value)
  //       .reduce((total, current) => current ? total + current : total, 0);
  //     return totalChecked >= min ? null : { required: true };
  //   }
  //   return validator;
  // }

  // RequiredMinCheckbox atualizado

  // /**
  //  * 
  //  * @param min - Mínimo de checkboxes a serem selecionadas
  //  * @returns - Retorna o nulo se o número de checkboxes for igual ou maior que o mínimo. Ou required: true, caso o contrário
  //  */
  // requiredMinCheckBox(min = 1){
  //   const validator = (formArray: AbstractControl) => {
  //     if(formArray instanceof FormArray){
  //       const totalChecked = formArray.controls.map(v => v.value)
  //         .reduce((total: number, atual: number) => (atual ? total + atual : total), 0);
  //       return totalChecked >= min ? null : {required: true};
  //     }
  //     throw new Error('formArray is not an instance of FormArray');
  //   };
  //   return validator;
  // }

  submit() {
    console.log(this.formulario.value);

    let valueSubmit = Object.assign({}, this.formulario.value)

    /**
     * Passa pelo array de frameworks, e se for true, pega somente o valor, caso o for false, retorna null. E pra refinar, filtra os que são diferentes de nulo, fazendo assim com que os nulos não apareçam
     */
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: any, i: any) => v ? this.frameworks[i] : null)
        .filter((v: any) => v !== null)
    })

    console.log(valueSubmit);

    this.http.post(`https://httpbin.org/post`, JSON.stringify(valueSubmit))
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

    setarCargo() {
      const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' }
      this.formulario.get('cargo')?.setValue(cargo);
    }

    compararCargos(obj1: Cargo, obj2: Cargo) {
      return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
    }

    setarTecnologias() {
      this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php']);
    }

    // Gambiarra achada em um comentário
    getFrameworksControls() {
      return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
    }

    // Validação assíncrona
    validarEmail(formControl: FormControl) {
      return this.verificaEmailService.verificarEmail(formControl.value)
        .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null))
    }
}
