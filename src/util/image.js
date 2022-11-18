import { ExecAsync } from "./scripting.js";

export async function CreateMosaic
(
  targetImagePath,
  tileImagesPath,
  resultImagePath,
  resultImageName
)
{
  await ExecAsync(`python3 ./util/python/mosaic.py ${targetImagePath} ${tileImagesPath} ${resultImagePath}${resultImageName}`);
}