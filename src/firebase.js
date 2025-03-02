import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBEYqR88PTJspwhPRxBz5frJvKy6pcU9nY',
//   authDomain: 'shopper-76cf8.firebaseapp.com',
//   projectId: 'shopper-76cf8',
//   storageBucket: 'shopper-76cf8.firebasestorage.app',
//   messagingSenderId: '907720880589',
//   appId: '1:907720880589:web:e37ff45b707830ced31484',
// }
const firebaseConfig = {
  apiKey: 'AIzaSyBf_uf0n_XWvWqyEubmQ-vXE7dr7VCoZcg',
  authDomain: 'adventcalendar-31f92.firebaseapp.com',
  databaseURL:
    'https://adventcalendar-31f92-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'adventcalendar-31f92',
  storageBucket: 'adventcalendar-31f92.appspot.com',
  messagingSenderId: '419868581918',
  appId: '1:419868581918:web:006dbbc6cd1995408c4e0f',
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)
const storage = getStorage(app)

// Get Firebase Authentication service
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {
  auth,
  provider,
  signInWithPopup,
  firestore,
  collection,
  onSnapshot,
  storage,
}
