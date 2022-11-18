import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { CreateMosaic } from "./util/image.js";
import { MoveFile, DeleteFile, CreateDirectory } from "./util/files.js";

import express from "express";
import cors from "cors";
// import qs from "qs"
const app = express();
// app.setting('query parser', function (str) {
//   return qs.parse(str, { /* custom options */ });
// });
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
const port = 3000;

import multer from "multer";
const upload = multer({ dest: "temp/" });

function getFileExtension(filename) {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
}

const checkForRequiredParameters = (req, parameters) => {
  for (let i = 0; i < parameters.length; i++) {
    if (!req.body.hasOwnProperty(parameters[i])) {
      throw new Error(
        "'{0}'".format(parameters.join(", ")) + " parameter(s) required"
      );
    }
  }
};

app.get("/admin/mosaics", async (req, res, next) => {
  try {
    const mosaics = await prisma.photoMosaic.findMany({
      include: {
        raffle: true,
      },
    });
    res.json(mosaics);
  } catch (err) {
    next(err);
  }
});

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

    const mosaicFolderPath = `public/mosaics/${photoMosaic.id}`;
    await CreateDirectory(mosaicFolderPath);
    await CreateDirectory(`${mosaicFolderPath}/images`);

    res.json(photoMosaic);
  } catch (err) {
    next(err);
  }
});

app.post(
  `/admin/mosaic/:mosaicId/target-image`,
  upload.single("image"),
  async (req, res) => {
    const { mosaicId } = req.params;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("FILES:", req.files);
    const file = req.file;
    const fileExtension = "." + getFileExtension(file.originalname);

    // Move the image from the temp folder..
    // ..to public/mosaics/mosaicId/target.jpg (or whatever the extension is).
    MoveFile(file.path, `public/mosaics/${mosaicId}/target${fileExtension}`);

    // Save the filename and path for the target.
    const updatePhotoMosaic = await prisma.photoMosaic.update({
      where: {
        id: parseInt(mosaicId),
      },
      data: {
        targetFilename: `target${fileExtension}`,
        targetPath: `/mosaics/${mosaicId}/`,
      },
    });

    // Return the path + filename.
    res.json(updatePhotoMosaic);
  }
);

app.get("/admin/mosaic/:mosaicId", async (req, res, next) => {
  try {
    const { mosaicId } = req.params;
    const mosaic = await prisma.photoMosaic.findUnique({
      where: { id: parseInt(mosaicId) },
      include: {
        images: true,
        raffle: true,
      },
    });
    res.json(mosaic);
  } catch (err) {
    next(err);
  }
});

app.post("/admin/mosaic/:mosaicId/generate", async (req, res) => {
  const { mosaicId } = req.params;

  const mosaic = await prisma.photoMosaic.findUnique({
    where: { id: parseInt(mosaicId) },
  });

  const targetImageFullPath = `/mosaics/${mosaicId}/${mosaic.targetFilename}`;
  const tileImagesPath = `/mosaics/${mosaicId}/images/`;
  const resultImagePath = `/mosaics/${mosaicId}/`;
  const resultImageName = "mosaic"; // Do not include the .jpeg extension.

  await CreateMosaic(
    "./public" + targetImageFullPath,
    "./public" + tileImagesPath,
    "./public" + resultImagePath,
    resultImageName
  );

  const updatedMosaic = await prisma.photoMosaic.update({
    where: {
      id: parseInt(mosaicId),
    },
    data: {
      mosaicFilename: resultImageName + ".jpeg",
      mosaicPath: resultImagePath,
    },
  });

  res.send(updatedMosaic);
});

app.delete("/test", async (req, res) => {
  const filePath = req.body.filePath;
  await DeleteFile("./public" + filePath);
  res.send("Delete successful");
});

app.get("/test2", async (req, res) => {
  const mosaicFolderPath = `public/mosaics/${42}`;
  await CreateDirectory(mosaicFolderPath);
  await CreateDirectory(`${mosaicFolderPath}/images`);
  res.send("Success");
});

app.delete("/admin/mosaic/:mosaicId/images", async (req, res) => {
  const { mosaicId } = req.params;
  const imageIds = req.body;

  const images = await prisma.image.findMany({
    where: {
      photoMosaicId: parseInt(mosaicId),
      id: {
        in: imageIds.map((id) => parseInt(id)),
      },
    },
  });

  const deletedImages = await prisma.image.deleteMany({
    where: {
      photoMosaicId: parseInt(mosaicId),
      id: {
        in: imageIds.map((id) => parseInt(id)),
      },
    },
  });

  images.forEach(async (image) => {
    await DeleteFile("./public" + image.path + image.filename);
  });

  res.json(deletedImages);
});

app.post(
  "/fan/mosaic/:mosaicId/images",
  upload.array("images"),
  async (req, res, next) => {
    try {
      const { mosaicId } = req.params;
      const fullName = req.body.fullName.toString();
      const images = req.files;

      console.log("mosaicId:", mosaicId);
      console.log("fullName:", fullName);
      console.log("images:", images);

      let user = await prisma.user.findUnique({
        where: {
          name: fullName,
        },
      });

      if (user === null) {
        user = await prisma.user.create({
          data: {
            name: fullName,
          },
        });
      }

      const resp = [];
      await Promise.all(
        images.map(async (image) => {
          const fileExtension = "." + getFileExtension(image.originalname);

          // First create the image to generate the id..
          const createdImage = await prisma.image.create({
            data: {
              filename: "temp",
              path: `/mosaics/${mosaicId}/images/`,
              userId: user.id,
              photoMosaicId: parseInt(mosaicId),
            },
          });

          // ..then use the id to set the file's filename.
          const updatedImage = await prisma.image.update({
            where: {
              id: createdImage.id,
            },
            data: {
              filename: `${createdImage.id}${fileExtension}`,
            },
          });

          MoveFile(
            image.path,
            `public/${updatedImage.path}${updatedImage.filename}`
          );

          resp.push(updatedImage);
        })
      );

      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
