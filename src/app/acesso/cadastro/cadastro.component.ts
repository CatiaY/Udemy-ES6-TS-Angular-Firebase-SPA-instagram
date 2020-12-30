import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { useAnimation, style, trigger, state, transition } from '@angular/animations';

import { Usuario } from '../usuario.model'
import { Autenticacao } from '../../autenticacao.service'
import { AnimacaoVibrar, vibrarAnimation } from '../animacao-vibrar'


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
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

export class CadastroComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup({
    // Implementar as validações e controlar os estados visuais
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'nome_completo': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'nome_usuario': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'senha': new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  public mensagemErro: string
  public vibrar: string = "vibrar-inicio"  

  constructor(
    private autenticacao: Autenticacao
  ) { }

  ngOnInit(): void {
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  public cadastrarUsuario(): void {
    //console.log(this.formulario)

    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha,
    )
    //console.log(usuario)

    // Obs.: O método cadastrarUsuario() é uma Promise
    this.autenticacao.cadastrarUsuario(usuario)
    .then(() => {
      this.exibirPainelLogin()
    })
    .catch((error: Error) => {
      this.mensagemErro = error.message
      this.vibrar = AnimacaoVibrar.vibrarAnimacao(this.vibrar)
    })     
  }
}
