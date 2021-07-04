import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const app = firebase.initializeApp({
  apiKey: "AIzaSyDL4h5bP_UuBWpUcZxHxutlXAFlucVAJgk",
  authDomain: "taugor-6edc2.firebaseapp.com",
  projectId: "taugor-6edc2",
  storageBucket: "taugor-6edc2.appspot.com",
  messagingSenderId: "829521335561",
  appId: "1:829521335561:web:d4d141b86cf92e6a5b6fd8",
  measurementId: "G-1D489K6KRL",
});

export const auth = app.auth()
export default app
