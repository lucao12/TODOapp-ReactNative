import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyDDBlQ7eQZ6GYNQL5EFMP3xXvyYMgEbixs",
    authDomain: "todoapp-e6d76.firebaseapp.com",
    projectId: "todoapp-e6d76",
    storageBucket: "todoapp-e6d76.appspot.com",
    messagingSenderId: "455263038138",
    appId: "1:455263038138:web:a4ece9e7b28b1153bab083",
    measurementId: "G-85RWSGGYBK"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export default firebase;