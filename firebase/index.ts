import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: 'expashare-b489e.firebaseapp.com',
    projectId: 'expashare-b489e',
    storageBucket: 'expashare-b489e.appspot.com',
    messagingSenderId: '676459158535',
    appId: '1:676459158535:web:c660eb82a104497fd95ea2',
    measurementId: 'G-CVL85157CJ',
};

const app = initializeApp(firebaseConfig);

export default app;
