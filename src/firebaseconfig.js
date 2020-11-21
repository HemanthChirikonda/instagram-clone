import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyB0HSD3_2idlO7DPSJuQ3L16IRhA0pNzgM",
	authDomain: "instagramclone-2c88e.firebaseapp.com",
	databaseURL: "https://instagramclone-2c88e.firebaseio.com",
	projectId: "instagramclone-2c88e",
	storageBucket: "instagramclone-2c88e.appspot.com",
	messagingSenderId: "498275060078",
	appId: "1:498275060078:web:ea29710e6716bfe389197f",
	measurementId: "G-VVLGSNXY4E",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
