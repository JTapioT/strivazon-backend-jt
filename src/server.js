import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import reviewsRouter from "../src/services/reviews/index.js";
import productsRouter from "./services/products/index.js";

import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";


const server = express();


//Middleware
server.use(cors());
server.use(express.json());
server.use(express.static(join(process.cwd(), "/public")));

// Endpoints
server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);
// Error-handling middleware
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const port = 3001;
console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port:", port);
});

export default server;
