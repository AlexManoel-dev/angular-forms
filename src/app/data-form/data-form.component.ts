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
  formulario: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Criando formulário reativo
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // });

    // Outra forma de criar formulários reativos
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });

    //[Validators.required, Validators.minLength(3), Validators.maxLength(20)]
  }

  onSubmit() {
    console.log(this.formulario.value);

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
  }

  resetar() {
    this.formulario.reset();
  }

  // Verificando se o campo é válido ou o valor dele foi alterado, pelo component
  verificaValidTouched(campo: any) {

    // Acesso do campo desejado
    //this.formulario.controls[campo]

    // Existe também o get
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail?.errors) {
      // A gente consegue acessar o email dentro de errors, porque o javascript também trata arrays e objetos como dicionário(chave-valor)
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  // Aplicando css no [ngClass] por meio do componente
  aplicaCssErro(campo: any) {
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }
}
