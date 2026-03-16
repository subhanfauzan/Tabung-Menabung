import { Request, Response, NextFunction } from "express";

/**
 * Validation middleware for request body
 */
export const validateRequest = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
      return;
    }

    next();
  };
};
