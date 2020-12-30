import { Component, OnInit, Input } from '@angular/core'
import { BancoDados} from '../../banco-de-dados.service'

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})

export class PublicacoesComponent implements OnInit {

  // Variável que recebe o valor de home para realizar o data binding
  @Input() public publicacoes: any

  constructor( private bancoDados: BancoDados ) { }

  ngOnInit(): void {
  }

  }
