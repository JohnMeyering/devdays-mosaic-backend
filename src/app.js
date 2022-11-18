import { CreateMosaic } from "./util/image.js";

import express from 'express';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const targetImagePath = "~/images/test.jpg";
  const tileImagesPath = "~/images/airplane";
  const resultImagePath = ""
  const resultImageName = "api_test_mosaic"; // Do not include the .jpeg extension

  await CreateMosaic(targetImagePath, tileImagesPath, resultImagePath, resultImageName)
  
  res.send(`Hello World! ${resultImagePath}${resultImageName}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})