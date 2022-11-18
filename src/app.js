import { CreateMosaic } from "./util/image.js";

import express from 'express';
const app = express();
const port = 3000;
app.use(express.static('../public'))

app.get('/', async (req, res) => {
  // These variables need to be dynamic.
  const targetImagePath = "~/images/test.jpg";
  const tileImagesPath = "~/images/airplane";
  const resultImagePath = "../public/images/"
  const resultImageName = "api_test_mosaic"; // Do not include the .jpeg extension

  await CreateMosaic(targetImagePath, tileImagesPath, resultImagePath, resultImageName)
  
  res.send(`Hello World! /public/images/${resultImageName}.jpeg`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})