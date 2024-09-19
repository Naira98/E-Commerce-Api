import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
  };