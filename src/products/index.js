import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import {
  getReviewsJSON,
  getProductsJSON,
  writeProductsJSON,
} from "../lib/fs-tools.js";
import { productValidationMiddlewares } from "./validation.js";
import { parseFile, uploadFile } from "../upload/index.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
    try {
      const products = await getProductsJSON();
      if (!products.length) {
        next(createHttpError(404, "No products found."));
      }

      if (req.query.length) {
        // Query comes as an object, get the keys in array form:
        const queryKeysArr = Object.keys(req.query);
        //console.log(queryKeysArr);
        // Whitelist product details to have the query for:
        const whiteList = ["category", "name", "price", "brand", "description"];
        // With some() method, check if at least one returns -1 (No match within whitelist when using indexOf)
        let isQueryNonValid = queryKeysArr.some((queryValue) => {
        return whiteList.indexOf(queryValue) === -1
        });


        let filteredProducts;
        if(!isQueryNonValid) {
          console.log("here");
          // For checking against the values within product details:
          let queryValuesArr = Object.values(req.query);

          // If more than one query parameters:
          if(queryValuesArr.length > 1) {
            filteredProducts = products.filter(product => {
                return [product.name, product.category, product.price, product.brand, product.description].some(value => queryValuesArr.includes(value) === true
                )
              })
            console.log(filteredProducts);
            res.send(filteredProducts);
          } else {
            filteredProducts = products.filter((product) => {
              return product[Object.keys(req.query)[0]]
                .toLowerCase()
                .includes(Object.values(req.query)[0]);
            }
            );
            res.send(filteredProducts);
          }
        }
      } else {
        res.send(products);
      }
    } catch (error) {
      next(error);
    }
  /* try {
    const products = await getProductsJSON();
    console.log(products);
    res.send(products);
  } catch (error) {
    next(error);
  } */
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProductsJSON();
    const product = products.find((p) => p._id === req.params.productId);
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Products with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviewsJSON();
    const reviewsByProductId = reviews.filter(
      (review) => review.productId === req.params.productId
    );
    if (reviewsByProductId.length) {
      res.send(reviewsByProductId);
    } else {
      next(
        createHttpError(404, `No reviews found for ${req.params.productId}`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const products = await getProductsJSON();
        const newProduct = {
          _id: uniqid(),
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        products.push(newProduct);
        await writeProductsJSON(products);
        res.status(201).send({ _id: newProduct._id });
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.put(
  "/:productId",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const products = await getProductsJSON();
        const index = products.findIndex(
          (product) => product._id === req.params.productId
        );
        const productToModify = products[index];
        const updatedFields = { ...req.body, updatedDate: new Date() };
        const updatedProduct = { ...productToModify, ...updatedFields };
        products[index] = updatedProduct;
        await writeProductsJSON(products);
        res.status(200).send({ _id: products[index]._id });
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProductsJSON();
    const remainingProducts = products.filter(
      (product) => product.id !== req.params.productId
    );
    await writeProductsJSON(remainingProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

productsRouter.put(
  "/:productId/upload",
  parseFile.single("upload"),
  uploadFile,
  async (req, res, next) => {
    try {
      const products = await getProductsJSON();
      const index = products.findIndex(
        (product) => product._id === req.params.productId
      );

      const productToModify = products[index];
      const updatedFields = {
        imageUrl: req.file,
        updatedAt: new Date(),
      };

      const updatedProduct = { ...productToModify, ...updatedFields };
      products[index] = updatedProduct;

      products.push(updatedProduct);
      await writeProductsJSON(products);
      res.status(201).send({ _id: products[index]._id });
    } catch (error) {
      next(error);
    }
  }
);
export default productsRouter;
