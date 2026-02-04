import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos la base de datos

const firebaseConfig = {
  apiKey: "AIzaSyB5qVsrSfb9fxV1xv9bZisqE0tJVAUA6EQ",
  authDomain: "master-1a5de.firebaseapp.com",
  projectId: "master-1a5de",
  storageBucket: "master-1a5de.firebasestorage.app",
  messagingSenderId: "113206988997",
  appId: "1:113206988997:web:ba9d173920c83f5f4220ac",
  measurementId: "G-KYSRPER06G"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos 'db' para usarla en toda la aplicación
export const db = getFirestore(app);