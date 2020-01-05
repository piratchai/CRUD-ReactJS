import * as firebase from 'firebase/app';

export default function initFirebase(){
    var config = {
        apiKey: "AIzaSyAcOt8Y4jDEJ0dlgYGu-n3Pc8j6yDKlYwU",
        authDomain: "fir-course-4608c.firebaseapp.com",
        databaseURL: "https://fir-course-4608c.firebaseio.com",
        projectId: "fir-course-4608c",
        storageBucket: "fir-course-4608c.appspot.com",
        messagingSenderId: "297313670517",
        appId: "1:297313670517:web:3b341339d2c4e7c7a06f3c"
    }

    firebase.initializeApp(config);
}