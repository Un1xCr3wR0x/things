importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '326227681257'
});

const messaging = firebase.messaging();
