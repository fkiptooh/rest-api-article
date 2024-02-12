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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
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
export {addEntry, getAllEntries, updateEntry, deleteEntry};
