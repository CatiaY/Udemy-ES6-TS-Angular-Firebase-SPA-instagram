import { Injectable } from '@angular/core'
import firebase from 'firebase/app'
import { Progresso } from './progresso.service'
import { Publicacao } from './home/publicacao.model'

@Injectable()
export class BancoDados {
    
    constructor( private progresso: Progresso ) { }

    public publicar(publicacao: any): void {

        // Upload de texto: firebase>database
        // ref() criar dentro do firebase o path publicacoes/emailUsuario, que guardará as publicações
        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`) 
            // Insere um objeto literal dentro do path indicado em ref(). push() gera um identificador único no banco de dados que representa o documento enviado
            .push( { titulo: publicacao.titulo })
            .then((resposta: any) => {
                // Obtém a key gerada pela inserção do documento no firebase. Ela possui um valor único, por isso é mais seguro utilizá-la como nome associado à imagem da publicação
                let nomeImagem = resposta.key

                // Upload de arquivos: firebase>storage
                firebase.storage().ref()
                // child recebe o path e o nome da imagem (renomeada)
                .child(`imagens/${nomeImagem}`)
                .put(publicacao.imagem) // Verbo http que envia referência dos dados da imagem
                // Para acompanhar o progresso de upload no firebase, será usado o Listener on, que permite escutar um evento e tomar algumas ações
                // on() recebe como parâmetro um estado, um Observable e dois callbacks
                .on(firebase.storage.TaskEvent.STATE_CHANGED, 
                    // Ação voltada para o acompanhamento do upload. Funciona como um Observable que vai capturando os eventos de atualização de estado (STATE_CHANGED)
                    (snapshot: any) => // Função que ficará observando os eventos de progresso do upload. snapshot é como uma foto em um determinado momento no progresso do upload
                    {
                        //console.log('Snapshot capturado no on: ', snapshot)
                        this.progresso.status = 'andamento'
                        this.progresso.estado = snapshot
                    },
                    // Ação que será executada em caso de erro
                    (error) => 
                    {
                        //console.log(error)
                        this.progresso.status = 'erro'
                    },
                    // Finalização do processo
                    () => 
                    {
                        //console.log('Upload completo')
                        this.progresso.status = 'concluido'
                    }
                ) 
            })
    }

    // Recupera as publicações de dentro do nó do usuário
    // Obs.: No firebase, os arquivos armazenados no storage ficam protegidos e não podem ser acessados diretamente. É necessário fazer o download da url que contém o token válido de acesso de cada um daqueles arquivos
    public consultaPublicacoes(emailUsuario: string): Promise<any> {

        return new Promise((resolve, reject) => {
            // Obs.: Essa consulta é uma Promise
            // Consulta as publicações em database
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`) // Envio da referência para consulta
                // Para recuperar os documentos com as postagens    
                // Método on() é um Listener que fica escutando alterações no path para que seja possível realizar ações conforme haja mudança
                // Método once() faz uma única consulta no momento em que o método é  executado (similar a um snapshot/foto do momento atual do path)
                .orderByKey() // Ordena as publicações pela ordem da chave (conforme elas foram criadas, ou seja, do primeiro para o último). Porém, no resultado final, os elementos podem aparecer fora de ordem por causa do processamento assíncrono.
                .once('value') // Evento que será escutado
                .then((snapshot: any) => {
                    //console.log(snapshot.val())

                    // Array que conterá os dados da publicação
                    let publicacoes: Array<any> = []

                    // Percorre cada um dos objetos de dentro do snapshot e obtém o atributo key (que corresponde ao nome atribuído às imagens)
                    snapshot.forEach((childSnapshot: any) => {
                        
                        // Recupera o valor dos documentos salvos na database
                        let publicacao = childSnapshot.val()
                        publicacao.key = childSnapshot.key
                        
                        publicacoes.push(publicacao)
                    })

                    // publicacoes é enviada por parâmetro ao then() logo abaixo
                    // reverse() inverte a ordem do array, para que as publicações mais novas sejam exibidas no topo da página
                    return publicacoes.reverse()
                })
                .then((publicacoes: any) => { 
                    //console.log(publicacoes) 

                    publicacoes.forEach((publicacao: any) => {
                        firebase.storage().ref()
                        .child(`imagens/${publicacao.key}`) // Caminho da imagem
                        .getDownloadURL() // É necessário fazer o download da url para obter um token válido. É uma Promise
                        .then((url: string) => {
                                                        
                            // Monta um objeto dentro de cada iteração, que recupera o valor do snapshot (o documento) e a url da imagem associada àquele documento
                            publicacao.url_imagem = url

                            // Consultar o nome do usuário da publicação
                            firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                .once('value')
                                .then((snapshot: any) => {
                                    //console.log(snapshot.val().nome_usuario)
                                    publicacao.nome_usuario = snapshot.val().nome_usuario
                                })                            
                        })
                    })
                    
                    resolve(publicacoes)
                })
        })
    }    
}