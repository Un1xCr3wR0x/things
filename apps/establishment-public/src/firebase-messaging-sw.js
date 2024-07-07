/**
const clients = [];
self.addEventListener('message', event => {
  if (event.data === 'ping') {
    clients.push(event.source);
  }
});
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyD10cnmij0t3-6Q61BFwACIMLtvFzp54sA',
  projectId: 'gosi-firebase',
  messagingSenderId: '326227681257',
  appId: '1:326227681257:web:b7e27656ab0d1a8eef7578'
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  payload.fromBackground = true;
  for (let i = 0; i < clients.length; i++) {
    clients[i].postMessage(payload);
  }
});
 */
