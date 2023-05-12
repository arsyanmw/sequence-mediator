import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database';

const config = {
    apiKey: "AIzaSyBprQtXrtyuwEQQYMNl0D98YvmOruWveIs",
    authDomain: "sequence-timer.firebaseapp.com",
    databaseURL: "https://sequence-timer-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sequence-timer",
    storageBucket: "sequence-timer.appspot.com",
    messagingSenderId: "835828620269",
    appId: "1:835828620269:web:ebc9b5a3e20f89a6c365e4"
};

export const db = getDatabase(initializeApp(config));