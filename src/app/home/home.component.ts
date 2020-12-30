import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Autenticacao } from '../autenticacao.service'
import { BancoDados } from '../banco-de-dados.service'
import { Publicacao } from './publicacao.model'
import firebase from 'firebase'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // Ambos os componentes filhos conseguirão emitir eventos para que a home atualize a página  
  public publicacoes: any[]
  public email: string

  constructor( 
    private autenticacao: Autenticacao,
    private bancoDados: BancoDados ) { }

  ngOnInit(): void {

    // Obtém o e-mail do usuário autenticado
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarTimelineHome()
    })
  }

  public sair(): void {
    // Chama um método do serviço de autenticação    
    this.autenticacao.sair()
  }

  // Obtém as publicações do banco de dados  
  public atualizarTimelineHome(): void {
    
    // Retorna uma Promise
    this.bancoDados.consultaPublicacoes(this.email)
      .then((publicacoes: Publicacao[]) => {        
        this.publicacoes = publicacoes        
      })    
  }
}
