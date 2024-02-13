import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {handleError} from "../utils/error_handler";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
// import { userAuth } from "../config/firebase";

const create = async (req: Request, res: Response) => {
  try {
    const {displayName, password, email, role} = req.body;

    if (!displayName || !password || !email || !role) {
      res.status(400).send({message: "Mising field!"});
    }

    const {uid} = await admin.auth().createUser({
      displayName,
      password,
      email,
    });

    await admin.auth().setCustomUserClaims(uid, {role});

    res.status(201).send({uid});
  } catch (error) {
    handleError(res, req);
  }
};

const mapUser = (user: admin.auth.UserRecord) => {
  const customClaims = (user.customClaims || {role: ""}) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};

const all = async (req: Request, res: Response) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send({users});
  } catch (err) {
    return handleError(res, err);
  }
};

const get =async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send({user: mapUser(user)});
  } catch (err) {
    return handleError(res, err);
  }
};

const patch = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {displayName, password, email, role} = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({message: "Missing fields"});
    }

    await admin.auth().updateUser(id, {displayName, password, email});
    await admin.auth().setCustomUserClaims(id, {role});
    const user = await admin.auth().getUser(id);

    return res.status(204).send({user: mapUser(user)});
  } catch (err) {
    return handleError(res, err);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await admin.auth().deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
};

const login = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    res.status(200).send({user});
  } catch (error: any) {
    // Authentication failed
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(401).send({errorCode, errorMessage});
  }
};


export {create, all, get, patch, remove, login};
