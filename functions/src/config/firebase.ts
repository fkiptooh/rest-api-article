import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
// import {ServiceAccount} from "firebase-admin";

dotenv.config();

// const serviceAccount: ServiceAccount = {
//   projectId: process.env.MY_APP_FIREBASE_PROJECT_ID,
//   clientEmail: process.env.MY_APP_FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.MY_APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
// };

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.MY_APP_FIREBASE_PROJECT_ID,
    clientEmail: process.env.MY_APP_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.MY_APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: "https://rest-api-journal-b8c7b.firebaseio.com",
});

const db = admin.firestore();


export {admin, db};

// Now Firebase Admin is initialized and ready for use
