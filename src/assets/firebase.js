import firebase from 'firebase/app'
require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyDPLyYKmxXjSYuDvdOODQP42_6fB5c71ro",
    authDomain: "gameknights-4367f.firebaseapp.com",
    databaseURL: "https://gameknights-4367f-default-rtdb.firebaseio.com",
    projectId: "gameknights-4367f",
    storageBucket: "gameknights-4367f.appspot.com",
    messagingSenderId: "284824312395",
    appId: "1:284824312395:web:a83653fbde8ce28f3f0bce",
    measurementId: "G-YF27NQLPTE"
  };


  const app = firebase.initializeApp(firebaseConfig);

export default app