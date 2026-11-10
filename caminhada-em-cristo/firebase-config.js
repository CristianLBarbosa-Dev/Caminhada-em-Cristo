/* ============================================================
   CONFIGURAÇÃO DO FIREBASE — Caminhada em Cristo
   ============================================================
   1. Acesse https://console.firebase.google.com
   2. Crie um projeto novo (gratuito, plano "Spark").
   3. No menu do projeto, vá em "Compilação" > "Authentication" >
      "Vamos começar" > ative o provedor "E-mail/senha".
   4. Vá em "Compilação" > "Firestore Database" > "Criar banco de
      dados" (escolha o modo "produção" e a região mais próxima).
   5. Em "Regras" do Firestore, cole o conteúdo do arquivo
      firestore.rules deste projeto e publique.
   6. Volte em "Configurações do projeto" (ícone de engrenagem) >
      role até "Seus aplicativos" > clique no ícone "</>" (Web) >
      registre um app (qualquer nome) > copie o objeto de
      configuração que aparece e cole abaixo, substituindo os
      valores de exemplo.
   Tudo isso é gratuito — o plano Spark do Firebase não exige
   cartão de crédito e cobre com folga o uso deste site.

   IMPORTANTE: este arquivo é carregado como um script comum
   (<script src="firebase-config.js">), não como módulo ES.
   Por isso ele NÃO deve conter "import" nem "export" — apenas
   a variável FIREBASE_CONFIG abaixo.
   ============================================================ */

var FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJrmAUE8UxAypKSjnJ0-bISaryumPban8",
  authDomain: "caminhda-em-cristo.firebaseapp.com",
  projectId: "caminhda-em-cristo",
  storageBucket: "caminhda-em-cristo.firebasestorage.app",
  messagingSenderId: "181732025520",
  appId: "1:181732025520:web:54f453d619188f38498775",
  measurementId: "G-97YXK6E4Z4"
};
