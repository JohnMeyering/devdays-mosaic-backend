import { ExecAsync } from "./util/scripting.js";

import express from 'express';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  await ExecAsync("ls -l");
  
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})