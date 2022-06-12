import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyBPY-wUBCAM-K1y0vNf5US_zfE5CBhj3bc",
  authDomain: "sistema-1c734.firebaseapp.com",
  projectId: "sistema-1c734",
  storageBucket: "sistema-1c734.appspot.com",
  messagingSenderId: "990672714543",
  appId: "1:990672714543:web:b33b861b8e49c42fa87fda",
  measurementId: "G-4QSBB3D9X7"
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export default firebase;