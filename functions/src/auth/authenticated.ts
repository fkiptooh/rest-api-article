import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";
import {error} from "firebase-functions/logger";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  const {authorization} = req.headers;

  if (!authorization) {
    res.status(401).send({message: "Unauthorized"});
  }

  if (!authorization?.startsWith("Bearer")) {
    res.status(401).send({message: "Unaithorized"});
  }

  const split = authorization?.split("Bearer ");

  if (split?.length !==2) {
    return res.status(401).send({message: "Unauthorized"});
  }

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log("Decoded token", JSON.stringify(decodedToken));
    res.locals = {
      ...res.locals,
      uid: decodedToken,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    return next();
  } catch (err: unknown) {
    if (error instanceof Error) {
      // console.error(`${err.code} - ${err.message}`)
      return res.status(401).send({message: "Unauthorized"});
    }
  }
};
