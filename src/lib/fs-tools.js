import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fs-extra
const { readJSON, writeJSON, writeFile } = fs;

// Folder path for JSON files
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
// Products JSON path
const productsJSONPath = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

// Read and write on products JSON files:
export function getProductsJSON() {
  return readJSON(productsJSONPath);
}
export function writeProductsJSON(content) {
  return writeJSON(productsJSONPath, content);
}

// Read and write reviews JSON files:
export function getReviewsJSON() {
  return readJSON(reviewsJSONPath);
}
export function writeReviewsJSON(content) {
  return writeJSON(reviewsJSONPath, content);
}

// Save product image
// 1. I guess before this we need public folder set-up for this. Then we can have a function for this

// eg.??
/* export function saveProductImage(filename, content) {
  return writeFile(join(productImageFolder, filename), content);
} */
