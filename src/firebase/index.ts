// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore} from "firebase/firestore";

import * as Firestore from "firebase/firestore";
import { IProject } from "../classes/Project";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA78skJ1JTlgQ5qI6Gp88cTgbFbp3qMzwA",
  authDomain: "optawebbapp.firebaseapp.com",
  projectId: "optawebbapp",
  storageBucket: "optawebbapp.appspot.com",
  messagingSenderId: "953618514891",
  appId: "1:953618514891:web:fd771b8a5539135bd26c4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore()


export function getCollection<T>(path:string) {
  return Firestore.collection(firebaseDB, path) as Firestore.CollectionReference<T>
}