import { Routes } from '@angular/router'
import { AcessoComponent } from './acesso/acesso.component'
import { HomeComponent } from './home/home.component'
import { AutenticacaoGuard } from './autenticacao-guard.service'

export const ROUTES: Routes = [
    { path: '', component: AcessoComponent},
    // canActivate associa o path a uma classe que possui uma lógica que define se a rota em questão pode ou não ser ativada. No caso, essa rota somente será ativada após a correta autenticação do usuário no firebase. AutenticacaoGuard é uma classe criada com o intuito de conter o método e a interface CanActivate que implementará a lógica de acesso e retornará um valor booleano
    { path: 'home', component: HomeComponent, canActivate: [ AutenticacaoGuard ]} 
]