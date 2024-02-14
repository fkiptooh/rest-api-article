import {initializeApp} from "firebase/app";
import {
  getAuth,

} from "firebase/auth";

const firebaseConfig =
  {
    //   apiKey: process.env.MY_APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    apiKey: process.env.MY_APP_FIREBASE_PRIVATE_KEY_API,
    authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
    projectId: process.env.MY_APP_FIREBASE_PROJECT_ID,
    //   storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
    //   messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
    //   appId: process.env.REACT_APP_DEV_APP_ID
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth};
