import { Injectable } from '@angular/core' // Necessária para injetarum serviço dentro de outro serviço
import { Router } from '@angular/router'
import { Usuario } from './acesso/usuario.model'
import firebase from "firebase/app";

@Injectable()
export class Autenticacao {

    // Variável pode ser declarada no constructor para não acusar erro de compilação caso não esteja ativada a opção ["strictNullChecks": false] de  "compilerOptions": {} do arquivo tsconfig.json
    public token_id: string

    constructor ( private router: Router) { }

    public cadastrarUsuario (usuario: Usuario): Promise<any> {
        
        // Encaminhar os dados para o firebase
        // auth() significa que as informações devem ser encaminhadas para a área Authentication da aplicação no server do firebase, qie é onde os registros dos usuários serão inseridos
        // Obs.: Os métodos do firebase são baseados em Promisses. No momento em que o firebase registrar o email e a senha, ele enviará uma resposta a essa requisisção, sendo possível fazer alguma tratativa em relação a ele
        // Obs.: Esse return é necessário para que o método que chamou a autenticação possa dar um feedback ao usuário de que o cadastro deu certo
        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
                //console.log(resposta)
                // Se houve sucesso na criação de usuário e senha, salva os demais dados na área Database

                // Remove a informação da senha do atributo senha do objeto usuario
                delete usuario.senha

                // Registra dados complementares do usuário no path email na base64
                // Enviar para ref() uma referência do path na qual os dados serão salvos. Os dados dos usuários ficarão salvos no path usuario_detalhe. Os dados de um usuário específico ficarão salvos na path usuario_detalhe/email
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`) // Os nós/paths não podem ter caracteres especiais, portanto, terá q converter o e-mail em uma equivalência na base 64 por meio da função btoa()
                // Métodos de persistência de dados: push() = faz a inclusão de documentos dentro do path. set() = com base na referência, faz a remoção de qualquer conteúdo que exista no path e faz a persistência somente de um único documento dentro daquele nó/path
                // Usa o método set() para ter referência de apenas um usuário por email    
                    .set(usuario) // Envia usuário, porém, sem a senha
            })            
    }

    public autenticar(email: string, senha: string): Promise<any> {
        
        return firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => {
                // Logou com sucesso, obtém o token de autenticação
                firebase.auth().currentUser.getIdToken() // Retorna uma Promise com o JWT (Jason Web Token) do processo de autenticação
                    .then ((idToken: string) => {
                        this.token_id = idToken
                        //console.log(this.token_id)
                        // Para gravar o token na memória do browser:
                        localStorage.setItem('idToken', idToken) // Chave, valor

                        this.router.navigate(['/home'])
                    })
            })            
    }

    public autenticado(): boolean {
        
        // Verificar se há um token armazenado no local storage
        if(this.token_id === undefined && localStorage.getItem('idToken') != null) {
            this.token_id = localStorage.getItem('idToken')
        }

        if(this.token_id === undefined) {
            // Se o usuário tentar forçar o acesso à página home, o app redireciona a página para a home
            this.router.navigate(['/'])
        }

        return this.token_id !== undefined                
    }

    public sair(): void {                
        // Desconecta a aplicação do firebase, removendo seu token
        firebase.auth().signOut()
            .then(() => {                
                // Remove o token salvo do local storage
                localStorage.removeItem('idToken')
                this.token_id = undefined

                // Volta para a página de acesso
                this.router.navigate(['/'])
            })
            .catch(function(error) {
                console.log('Erro')
                // An error happened.
              });
    }
}