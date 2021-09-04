

  var firebaseConfig = {
    apiKey: "AIzaSyCHPmTNwrl5cphaNz1GGSLTOlVnDsSCYoo",
    authDomain: "chat-e06ca.firebaseapp.com",
    projectId: "chat-e06ca",
    storageBucket: "chat-e06ca.appspot.com",
    messagingSenderId: "401291999874",
    appId: "1:401291999874:web:d5b4dcb8dd4a4cd3af929b",
    measurementId: "G-RPYS82EQB3"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const db = firebase.firestore();