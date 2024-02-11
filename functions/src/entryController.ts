import {Response} from "express";
import {db} from "./config/firebase";

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
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const getAllEntries = async (req: Request, res: Response) => {
  try {
    const allEntries: EntyType[] = [];
    const querySnapshot = await db.collection("entry").get();
    querySnapshot.forEach((document: any) => allEntries.push(document.data()));

    res.status(200).json(allEntries);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export {addEntry, getAllEntries};
