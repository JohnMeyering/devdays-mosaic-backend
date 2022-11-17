const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkParametersExist = (req, parameters) => {
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
    checkParametersExist(req, ["event_name"]);

    var mosaic = prisma.MosaicCreateInput;
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
