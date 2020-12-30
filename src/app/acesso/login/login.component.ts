import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { useAnimation, style, trigger, state, transition } from '@angular/animations';

import { Autenticacao } from '../../autenticacao.service'
import { AnimacaoVibrar, vibrarAnimation } from '../animacao-vibrar'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [ 
    trigger('animacao-erro-vibrar', 
    [
      state('vibrar-inicio', style({
        opacity: 1
      })),
      state('vibrar-fim', style({
        opacity: 1
      })),
      transition('vibrar-inicio <=> vibrar-fim', 
      [ useAnimation(vibrarAnimation) ])      
    ])    
   ]  
})

export class LoginComponent implements OnInit {

  // Auxiliar para enviar parâmetro ao componente pai (acesso.component)
  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup ({    
    // Refatorar o código acrescentando as verificações e mensagens de erro
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'senha': new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  public mensagemErro: string
  public vibrar: string = "vibrar-inicio"  

  constructor(
    private autenticacao: Autenticacao
  ) { }

  ngOnInit(): void {
  }

  public exibirPainelCadastro(): void {
    // Envia parâmetro ao componente pai (acesso.component)
    this.exibirPainel.emit('cadastro')
  }

  public autenticar(): void {
    //console.log(this.formulario)

    this.autenticacao.autenticar(
      this.formulario.value.email,
      this.formulario.value.senha
    )
    .catch((error: Error) => {
      this.mensagemErro = error.message
      this.vibrar = AnimacaoVibrar.vibrarAnimacao(this.vibrar)
    })
  }  
}
