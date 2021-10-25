import { body } from "express-validator";

export const reviewValidation = [
  body("comment")
    .exists()
    .isString()
    .withMessage("Comment is a mandatory field !"),
  body("rate").exists().isInt().withMessage("Rate is a mandatory field!"),
  body("productId").exists().isString().withMessage("Poduct ID is mandatory!"),
];
