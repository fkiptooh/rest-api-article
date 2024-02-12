/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as express from "express";
import * as functions from "firebase-functions";
import {
  addEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
} from "./entryController";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.get("/", (req, res) => res.status(200).send("Hey there"));

// Adding entry
app.post("/entry", addEntry);
app.get("/entry", getAllEntries);
app.patch("/entry/:entryId", updateEntry);
app.delete("/entry/:entryId", deleteEntry);

exports.app = functions.https.onRequest(app);
