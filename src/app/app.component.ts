import { Component, OnInit } from '@angular/core';

// Tem acesso a todos os recursos do sdk por meio de um alias
//import * as firebase from 'firebase/app'
import firebase from "firebase";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app3';

  ngOnInit(): void {
    // Cria a configuração do firebase. As informações foram retiradas ao subir o projeto no GitHub. 
    // Elas podem ser obtidas no site do firebase ao criar um novo banco de dados
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    };

    // Initialize Firebase
    // initializeApp() requer como parâmetro as configurações de conexão com o projeto do serviço criado dentro do firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
}
