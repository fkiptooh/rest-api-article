import {NextFunction, Request, Response} from "express";

export const isAuthorized = (opts: {
    hasRole: Array<"Teacher" | "Student">,
    allowSameUser?: boolean
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const {role, email, uid} = res.locals;
    if (email === "fkiptooh@gmail.com") {
      return next();
    }
    const {id} = req.params;

    if (opts.allowSameUser && uid && id === id) {
      return next();
    }

    if (!role) {
      return res.status(403).send();
    }

    if (opts.hasRole.includes(role)) {
      return next();
    }

    return res.status(403).json({message: "Fordidden"});
  };
};
