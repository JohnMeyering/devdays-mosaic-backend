import { PrismaClient } from "@prisma/client";

const express = require("express");
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.get("/admin/images", async (req, res) => {
  const images = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
