import express from "express";
import { getReviewsJSON, writeReviewsJSON } from "../../lib/fs-tools.js";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import { reviewValidation } from "./validation.js";


const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviewsJSON();
    console.log(reviews);
    if (reviews.length !== 0) {
      res.send(reviews);
    } else {
      next(createHttpError(404, `No reviews found`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviewsJSON();
    const index = reviews.findIndex((review) => review._id === req.params.id);
    if (index === -1) {
      next(createHttpError(404, `No review found ${req.params.id}`));
    } else {
      res.send(reviews[index]);
    }
  } catch (error) {
    next(error);
  }
});


reviewsRouter.put("/:id", reviewValidation, async (req, res, next) => {
  try {
    console.log(req.params);
    console.log(req.params.id);
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const reviews = await getReviewsJSON();
      const index = reviews.findIndex((review) => review._id === req.params.id);
      if (index === -1) {
        next(createHttpError(404, `Review not found ${req.params.id}`));
      }
      reviews[index] = {
        ...reviews[index],
        ...req.body,
        updatedAt: new Date(),
      };
      writeReviewsJSON(reviews);
      res.status(200).send({ _id: reviews[index]._id, message: "Success" });
    } else {
      next(createHttpError(400, { errorsList }));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviewsJSON();
    const index = reviews.findIndex((review) => review._id === req.params.id);
    if (index === -1) {
      next(createHttpError(404, "The review is not found!"));
    } else {
      const remainingReviews = reviews.filter(
        (review) => review._id !== req.params.id
      );
      writeReviewsJSON(remainingReviews);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post("/:productId", reviewValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const reviews = await getReviewsJSON();
      const newReview = { _id: uniqid(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
      reviews.push(newReview);
      writeReviewsJSON(reviews);
      res.status(201).send({ _id: newReview._id });
    } else {
      next(createHttpError(400, { errorsList }));
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;


