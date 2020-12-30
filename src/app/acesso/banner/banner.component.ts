import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Imagem } from './imagem.model'

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('banner', [
      state('escondido', style({ // style recebe um objeto literal que representa estilos css. Pode ser representado por 'background-image':'' ou backgroundImage:''
        opacity: 0 //visible:none, display:none
      })),
      state('visivel', style({
        opacity: 1
      })),
      // Transição de escondido para visivel: 'escondido => visivel'
      // Transição de visivel para escondido: 'visivel => escondido'
      // Transição para ambas as direções: <=>
      transition('escondido <=> visivel', animate('1s ease-in'))       
    ])
  ]
})

export class BannerComponent implements OnInit {

  public imagens: Imagem[] = [ // Array<Imagem>
    {estado: 'visivel', url: '/assets/banner-acesso/img_1.png'},
    {estado: 'escondido', url: '/assets/banner-acesso/img_2.png'},
    {estado: 'escondido', url: '/assets/banner-acesso/img_3.png'},
    {estado: 'escondido', url: '/assets/banner-acesso/img_4.png'},
    {estado: 'escondido', url: '/assets/banner-acesso/img_5.png'}
  ] 

  public estado: string = 'escondido'

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => this.logicaRotacao(), 3000) // Executa a função logicaRotacao() após 3 segundos. Obs.: setTimeout(this.logicaRotacao(), 3000) executaria a função antes dos 3 segundos, por isso é necessário envelopá-la em um wrapper
  }

  public logicaRotacao(): void  {
    // Auxilia na exibição da imagem seguinte
    let index: number = 0
    
    // Percorre cada imagem do array para verificar qual está visível e escondê-la
    for (let i: number = 0; i < this.imagens.length; i++) {      
      
      if (this.imagens[i].estado === 'visivel') {        
      
        this.imagens[i].estado = 'escondido'
        index = (i === (this.imagens.length - 1)) ? 0 : i + 1 // Se i for o último índice, atribuir zero ao index. Caso contrário, só aumentar o i
        break
      }
    }

    // Exibe a próxima imagem    
    this.imagens[index].estado = 'visivel'

    // Chama a si mesma de forma recursiva, para entrar em um looping infinito de exibição
    setTimeout(() => this.logicaRotacao(), 3000)
  }  
}
