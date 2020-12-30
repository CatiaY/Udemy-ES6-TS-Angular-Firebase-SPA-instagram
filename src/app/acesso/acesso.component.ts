import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css'],
  animations: [
    trigger('animacao-banner', 
    [
      state('criado', style({
        opacity: 1
      })),
      // Estado "void" indentifica um elemento que ainda não foi criado na árvore de elementos do DOM. No momento em que ele é criado, ocorre a transição de void para outro estado, sendo possível animar um elemento que acabou de entrar na árvore de elementos no DOM.
      // Obs.: Não precisa criar state void, pois ele é um estado reservado já existente na biblioteca
      // Quando o objeto for criado, a atribuição do estado 'criado' ao elemento já disparará a trigger, ou seja, a transição irá ocorrer automaticamente
      transition('void => criado', 
      [ 
        style({ opacity: 0, transform: 'translate(-50px, 0)'}), // translate() recebe as posições x e y originais, antes de chegarem à posição definida do elemento
        animate('500ms 0s ease-in-out') // duração da transição, delay (atraso do início da animação), aceleração (ease)
      ]) 
    ]),
    trigger('animacao-painel',
    [
      state('criado', style({
        opacity: 1
      })),
      transition('void => criado', 
      [
        style({ opacity: 0, transform: 'translate(50px, 0)'}),
        // keyframes() é o segundo parâmetro de animate(), e recebe um array de pontos (estilos) da animação

        // timeline:  0 void -----x-----------------------------------x---x---x--...--x--------x criado 1.5s//
        // keyframes:            0.15                              0.86 0.88 0.90...0.98         1

        animate('1500ms 0s ease-in-out', keyframes( // 1500ms ou 1.5s
          [ // offset especifica um tempo de 0 a 1 (0 a 100% do tempo total da animação) e marca a posição em que o keyframe será incluso dentro da animação
            style({ offset: 0.15, opacity: 1, transform: 'translateX(0)' }),
            style({ offset: 0.86, opacity: 1, transform: 'translateX(0)' }),

            style({ offset: 0.88, opacity: 1, transform: 'translateY(-10px)' }),
            style({ offset: 0.90, opacity: 1, transform: 'translateY(10px)' }),
            style({ offset: 0.92, opacity: 1, transform: 'translateY(-10px)' }),
            style({ offset: 0.94, opacity: 1, transform: 'translateY(10px)' }),
            style({ offset: 0.96, opacity: 1, transform: 'translateY(-10px)' }),
            style({ offset: 0.98, opacity: 1, transform: 'translateY(10px)' }),

            style({ offset: 1, opacity: 1, transform: 'translateX(0)' }) // Esse keyframe pode ser omitido. É o estado final
          ]
        )) // duração, delay e aceleração (ease)
      ])
    ])      
  ]
})

export class AcessoComponent implements OnInit {

  public estadoBanner: string = 'criado'
  public estadoPainel: string = 'criado'
  
  public cadastro: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  public exibirPainel(event: string): void { // event é a string enviada pelo método exibirPainel() do componetne filho
    //console.log('O parâmetro recebido no componente pai é: ', event)
    this.cadastro = event === 'cadastro' ? true : false
  }

  public inicioDaAnimacao(): void {
    //console.log('Início da animação')
  }

  public fimDaAnimacao(): void {
    //console.log('Fim da animação')
  }  
}
