importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
  authDomain: 'gosi-firebase.firebaseapp.com',
  databaseURL: 'https://gosi-firebase.firebaseio.com',
  projectId: 'gosi-firebase',
  storageBucket: 'gosi-firebase.appspot.com',
  messagingSenderId: '326227681257',
  appId: '1:326227681257:web:b7e27656ab0d1a8eef7578',
  measurementId: 'G-HC49J1B84W'
});
const messageListener = new BroadcastChannel('messageListener');
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  payload.fromBackground = true;
  messageListener.postMessage(payload);
});
