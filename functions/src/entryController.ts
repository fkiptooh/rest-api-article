import {Response} from "express";
import {db} from "./config/firebase";
import {v4 as uuidv4} from "uuid";

type EntyType = {
  title: string;
  content: string;
};

type Request = {
  body: EntyType;
  params: {
    entryId: string;
  };
};

type Questions = {
  id?: string;
  question: string
}
type Assignment = {
  topic: string,
  subject: string,
  isDue: Date,
  image?: string,
  description: string,
  questions: Questions[]
}

type QuestionRequest = {
  body: Assignment;
  params: {
    assignmentId: string,
    questionId?: string,
  }
}

const addEntry = async (req: Request, res: Response) => {
  const {title, content} = req.body;

  try {
    const entry = db.collection("entry").doc();

    const entryObject = {
      id: entry.id,
      title,
      content,
    };

    entry.set(entryObject);

    res.status(200).send({
      status: "Succes",
      message: "Entry added successfully",
      data: entryObject,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
};

const addAssignment = async (req: QuestionRequest, res: Response) => {
  // Destructure or define your required fields from the request body
  const {topic, subject, isDue, image, description, questions} = req.body;

  try {
    const assignment = db.collection("assignments").doc();

    const questionsWithIds = questions.map((question) => ({
      id: uuidv4(), // Generate a unique ID for each question
      ...question,
    }));

    // Construct your entry object based on the required structure
    const assignmentObject = {
      id: assignment.id, // Unique ID for the entry, automatically generated
      topic,
      subject,
      isDue,
      image,
      description,
      questions: questionsWithIds,
    };

    await assignment.set(assignmentObject);

    // Respond with the newly created entry object
    res.status(200).send({
      status: "Success", // Corrected typo from "Succes" to "Success"
      message: "Entry added successfully",
      data: assignmentObject,
    });
  } catch (error) {
    // Error handling
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    } else {
      res.status(500).json({message: "An unknown error occurred"});
    }
  }
};

const getQuestionById = async (req: QuestionRequest, res: Response) => {
  const { assignmentId, questionId } = req.params;

  try {
    const assignmentDoc = await db.collection("assignments").doc(assignmentId).get();

    if (!assignmentDoc.exists) {
      res.status(404).send({ message: "Assignment not found" });
    }

    const assignment: Assignment = assignmentDoc.data() as Assignment;
    const question = assignment.questions.find((q) => q.id === questionId);

    if (!question) {
      res.status(404).send({ message: "Question not found" });
    }

    res.status(200).send({ data: question });
  } catch (error) {
    console.error("Error fetching question: ", error);
    res.status(500).send({ message: "Error fetching question" });
  }
};

const getAssignments = async (req: QuestionRequest, res: Response) => {
  try {
    const assignmentsSnapshot = await db.collection("assignments").get();
    const assignments: Assignment[] = [];
    assignmentsSnapshot.forEach((doc: any) => {
      assignments.push(doc.data());
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    res.status(500).send("Error fetching assignments");
  }
};

const getAllEntries = async (req: Request, res: Response) => {
  try {
    const allEntries: EntyType[] = [];
    const querySnapshot = await db.collection("entry").get();
    querySnapshot.forEach((document: any) => allEntries.push(document.data()));

    res.status(200).json(allEntries);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
};

// Update
const updateEntry = async (req: Request, res: Response) => {
  const {body: {title, content}, params: {entryId}} = req;
  try {
    const entry = await db.collection("entry").doc(entryId);
    const currentData = (await entry.get()).data() || {};

    const updatedEntry = {
      id: entry.id,
      title: title || currentData.title,
      content: content || currentData.content,
    };

    entry.set(updatedEntry);

    res.status(200).json({
      status: "Success",
      message: "Entry updated successfully",
      data: updatedEntry,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
};

const deleteEntry = async (req: Request, res: Response) => {
  const {entryId} = req.params;

  try {
    const entry = db.collection("entry").doc(entryId);
    await entry.delete();

    res.status(200).json({
      status: 200,
      message: "Entry deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
};
export {
  addEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
  addAssignment,
  getAssignments,
  getQuestionById,
};
