import firebase from 'firebase/app';

// App's Firebase configuration (apiKey is domain restricted/secure)
const firebaseConfig = {
	apiKey: 'AIzaSyCT0x271QSMbWljMsyVsZrDrNjY13MfZQU',
	authDomain: '***REMOVED***',
	databaseURL: '***REMOVED***',
	projectId: 'ptrchoi-portfolio',
	storageBucket: '***REMOVED***',
	messagingSenderId: '***REMOVED***',
	appId: '1:***REMOVED***:web:1dca3c4804078594876978',
	measurementId: 'G-K4L5F4T55E'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
