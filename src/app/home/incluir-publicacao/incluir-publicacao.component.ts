import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { interval, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

import firebase from 'firebase/app'

import { BancoDados} from '../../banco-de-dados.service'
import { Progresso } from '../../progresso.service'

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})

export class IncluirPublicacaoComponent implements OnInit {

  // Referência ao elemento modal do DOM
  @ViewChild('meuModal') public meuModal: any;

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)    
  })

  public email: string
  private imagem: any

  // Exibe o formulário enquanto o envio estiver pendente ou em andamento
  public progressoPublicacao: string = 'pendente' 
  public porcentagemUpload: number // Calcula o progresso de upload

  // Variável auxiliar para somente executar um método enviando um evento para o componente pai
  @Output() public atualizarTimeline: EventEmitter<any> = new EventEmitter<any>()

  constructor( 
    private bancoDados: BancoDados,
    private progresso: Progresso
    ) { }

  ngOnInit(): void {

    // Recuperar o e-mail do usuário
    // onAuthStateChanged() é um método que se inscreve no Observable do firebase que dispara eventos se houver alterações no estado do usuário autenticado
    // Recebe os dados do usuário autenticado em user
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  public publicar(): void {
    
    this.bancoDados.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })
    
    // Observable para capturar as alterações de eventos
    let acompanhamentoUpload = interval(1500) // 1,5 segundos

    let continua = new Subject<boolean>()
    continua.next(true)

    acompanhamentoUpload
    .pipe(takeUntil(continua)) // Mantém o subscribe somente até atender a determinada condição, que no caso vem do Subject continua
    .subscribe(() => {  // Obs.: Poderia receber como parâmetro a contagem gerada pelo Observable interval

      this.progressoPublicacao = 'andamento'

      // Math.round arredonda o valor recebido
      this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred/this.progresso.estado.totalBytes) * 100)

      if (this.progresso.status === 'concluido') {
        this.progressoPublicacao = 'concluido'

        // Emitir um evento para o component parent (home), que será enviado ao componente publicacoes
        // Usa o EventEmitter
        this.atualizarTimeline.emit()

        continua.next (false)        
      }
    })        
  }

  public preparaImagemUpload(event: Event): void {

    // Alguns atributos do DOM precisam ser convertidos explicitamente para poderem ser acessados
    // imagem recebe um array de imagens
    this.imagem = (<HTMLInputElement>event.target).files
  }

  // Quando terminar o upload da publicação, reseta o menu  
  public novaPublicacao(): void {        
    this.formulario.reset()
    this.progressoPublicacao = 'pendente'    
  }
}