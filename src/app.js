import { ExecAsync } from "./util/scripting.js";

import express from 'express';
const app = express();
app.use(express.json());
const port = 3000;

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkForRequiredParameters = (req, parameters) => {
  for (var i = 0; i < parameters.length; i++) {
    if (!req.body.hasOwnProperty(parameters[i])) {
      throw new Error(
        "'{0}'".format(parameters.join(", ")) + " parameter(s) required"
      );
    }
  }
};

app.post("/admin/mosaic", async (req, res, next) => {
  try {
    checkForRequiredParameters(req, ["event_name"]);

    var mosaic;
    if (req.body.hasOwnProperty("prize")) {
      mosaic = {
        eventName: req.body.event_name,
        raffle: {
          create: {
            prize: req.body.prize,
          },
        },
      };
    } else {
      mosaic = {
        eventName: req.body.event_name,
      };
    }
    const photoMosaic = await prisma.photoMosaic.create({ data: mosaic });

    res.json(photoMosaic);
  } catch (err) {
    next(err);
  }
});

app.get("/admin/images/:mosaic_id", async (req, res) => {
  const { mosaic_id } = req.params;
  const images = await prisma.post.findMany({
    where: { photoMosaicId: mosaic_id },
  });
  res.json(images);
});

app.post("/fan/image/:mosaic_id", async (req, res, next) => {
  try {
    checkForRequiredParameters(req, ["full_name", "images"]);

    var { mosaic_id } = req.params;

    var images = req.body.images;
    var user = await prisma.user.findUnique({
      where: {
        name: req.body.full_name,
      },
    });

    if (user === null) {
      user = await prisma.user.create({
        data: {
          name: req.body.full_name,
        },
      });
    }

    var resp = [];
    await Promise.all(
      images.map(async (image) => {
        const image_data = {
          filename: image.filename,
          path: image.path,
          userId: user.id,
        };
        var created_image = await prisma.image.create({
          data: image_data,
        });
        resp.push(created_image);
      })
    );

    res.json(resp);
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  await ExecAsync("ls -l");
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
