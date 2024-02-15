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
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {
  addEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
  addAssignment,
  getAssignments,
  getQuestionById,
} from "./entryController";
import {routesConfig} from "./users/route_config";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
routesConfig(app);
app.get("/", (req, res) => res.status(200).send("Hey there"));

// Adding entry
app.post("/entry", addEntry);
app.get("/entry", getAllEntries);
app.patch("/entry/:entryId", updateEntry);
app.delete("/entry/:entryId", deleteEntry);
app.post("/assignment", addAssignment);
app.get("/assignments", getAssignments);
app.get('/assignments/:assignmentId/questions/:questionId', getQuestionById)


exports.api = functions.https.onRequest(app);
