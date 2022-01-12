import {NextFunction, Request, Response} from "express";
import { putVariantCookies } from "@zum-front-core/backend";


export const setupVariants = (req: Request, res: Response, next: NextFunction) => {

  putVariantCookies(req, res, {
    example: {
      A: 0.1,
      B: 0.2,
      C: 0.3,
      D: 0.4,
    }
  });

  next();

}
