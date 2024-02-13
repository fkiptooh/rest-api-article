import {Response} from "express";

export const handleError = (res: Response, err: any) => {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
};
