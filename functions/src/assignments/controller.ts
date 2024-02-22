import {Response} from "express";
import {db} from "../config/firebase";
import {v4 as uuidv4} from "uuid";

// type QuestionRequest = {
//   body: {
//     question: string;
//   }
// };

// interface Question {
//   id: string;
//   question: string;
// }

interface QuizRequest {
  questions: {
    question: string;
    id: string;
  }[];
}

interface Request {
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
    content: string;
    title: string;
    dateCreated: string;
    completed: string;
    dateUpdated: string;
    dateDue: string;
    quiz: QuizRequest[];
  };
}

interface GetQuestionByIdRequest extends Request {
  params: {
    quizId: string;
    questionId: string;
    homeworkId: string
  };
}

const addHomework = async (req: Request, res: Response) => {
  const {
    courseId,
    attachments,
    comments,
    schoolId,
    author,
    classId,
    content,
    title,
    dateCreated,
    dateDue,
    dateUpdated,
    completed,
    quiz,
  } = req.body;
  try {
    // add quiz homework
    const quizId = await addQuiz({
      dateDue,
      questions: quiz.map((question) => ({
        id: uuidv4(),
        ...question,
      })),
    });

    const homeworkRef = db.collection("homework").doc();
    const homeworkObject = {
      id: homeworkRef.id,
      courseId,
      attachments,
      comments,
      schoolId,
      author,
      classId,
      content,
      title,
      dateCreated,
      dateDue,
      dateUpdated,
      completed,
      quiz: quizId,
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

const addQuiz = async (quizObj: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const quizColRef = db.collection("quiz");

      const quizRef = await quizColRef.add(quizObj);
      resolve(quizRef.id);
    } catch (error) {
      reject(error);
    }
  });
};


const getHomeworkById = async (req: GetQuestionByIdRequest, res: Response) => {
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
const getQuizById = async (req:GetQuestionByIdRequest, res: Response) => {
  try {
    const {quizId} = req.params;

    const quizDoc = await db.collection("quiz").doc(quizId).get();
    if (!quizDoc.exists) {
      res.status(404).json({message: "Quiz not found!"});
    }

    const quizData = quizDoc.data();
    res.status(200).json({
      status: "Success",
      data: {id: quizId, ...quizData},
    });
  } catch (error: any) {
    res.send({message: "Server Error"});
  }
};

const getQuestionById = async (req: GetQuestionByIdRequest, res: Response) => {
  console.log(req.params);
  const {quizId, questionId} = req.params;
  console.log("Quiz ID:", quizId);
  console.log("Question ID:", questionId);
  try {
    const quizDoc = await db.collection("quiz").doc(quizId).get();

    if (!quizDoc.exists) {
      res.status(404).json({message: "Quiz not found"});
    }

    const quizData = quizDoc.data()!;

    if (!quizData || !quizData.questions) {
      res.status(404).json({message: "Questions not found in the quiz"});
    }

    const question = quizData.questions.find((q: any) => q.id === questionId);

    if (!question) {
      res.status(404).json({message: "Question not found"});
    }

    res.status(200).json({
      status: "Success",
      data: question,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching question", error: error.message,
    });
  }
};

export {
  addHomework,
  getHomeworkById,
  getAllHomework,
  getQuizById,
  getQuestionById,
};
