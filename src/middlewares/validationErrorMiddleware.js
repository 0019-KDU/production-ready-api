import { validationResult } from "express-validator";

export const handleValidationError = (req, res, next) => {
  const errors = validationResult(res);
  const errorArray = errors.array().map((err) => err.msg);
  if (errorArray.length > 0) {
    return res.status(400).json(errorArray);
    return;
  }
  next();
};
