import { ExecAsync } from "./util/scripting.js";

import express from 'express';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  // await ExecAsync("ls -l");
  const tileImagesPath = "~/images/airplane";
  const targetImagePath = "~/images/test.jpg";
  const resultImagePath = ""
  const resultImageName = "api_test_mosaic"; // Do not include the .jpeg extension

  await ExecAsync(`python3 ./util/python/mosaic.py ${targetImagePath} ${tileImagesPath} ${resultImagePath}${resultImageName}`)
  
  res.send(`Hello World! ${resultImagePath}${resultImageName}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})