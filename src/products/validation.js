import { body } from "express-validator";

export const productValidationMiddlewares = [
  body("name").exists().withMessage("Product name is required !!"),
  body("description")
    .exists()
    .withMessage("Products description is required !!"),

  body("brand").exists().withMessage("Products brand  is required !!"),
  body("price").exists().withMessage("Products price is required !!"),
  body("category").exists().withMessage("Products category is required !!"),
];
