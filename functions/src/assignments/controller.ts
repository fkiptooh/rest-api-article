import {Response} from "express";
import {db} from "../config/firebase";
import {v4 as uuidv4} from "uuid";

// type AnswerRequest = {
//     studentId: string;
//     answer: string;
// }

type QuestionRequest = {
    // questionId: string;
    question: string;
}

type QuizRequest = {
    // quizId: string;
    questions: QuestionRequest[];
}

type Request = {
    body: {
        courseId: string;
        attachments: string[];
        comments: string[];
        schoolId: string;
        author: {
            name: string;
            email: string;
            role: string;
        };
        classId: string;
        title: string;
        dateCreated: string;
        completed: string;
        dateUpdated: string;
        dateDue: string;
        quiz: QuizRequest[];
    },
    params: {
        homeworkId: string;
    }
}

const addHomework = async (req: Request, res: Response) => {
  const {
    courseId,
    attachments,
    comments,
    schoolId,
    author,
    classId,
    title,
    dateCreated,
    dateDue,
    dateUpdated,
    completed,
    quiz,
  } = req.body;

  try {
    const homeworkRef = db.collection("homework").doc();

    // Construct homework object
    const homeworkObject = {
      id: homeworkRef.id,
      courseId,
      attachments,
      comments,
      schoolId,
      author,
      classId,
      title,
      dateCreated,
      dateDue,
      dateUpdated,
      completed,
      quiz: quiz.map((quizItem) => ({
        id: uuidv4(),
        questions: quizItem.questions.map((questionItem) => ({
          id: uuidv4(),
          question: questionItem.question,
          answers: [],
        })),
      })),
    };

    await homeworkRef.set(homeworkObject);

    res.status(200).json({
      status: "Success",
      message: "Homework added successfully",
      data: homeworkObject,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};

const getHomeworkById = async (req: Request, res: Response) => {
  const {homeworkId} = req.params;

  try {
    const homeworkDoc = await db.collection("homework").doc(homeworkId).get();

    if (!homeworkDoc.exists) {
      res.status(404).json({error: "Homework not found"});
    }

    const homeworkData = homeworkDoc.data();

    res.status(200).json({
      status: "Success",
      data: homeworkData,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};

const getAllHomework = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("homework").get();

    const homeworkList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      status: "Success",
      data: homeworkList,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};

export {addHomework, getHomeworkById, getAllHomework};
