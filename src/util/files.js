import fs from "fs";

export function MoveFile(source, destination) {
  fs.rename(source, destination, function (err) {
    if (err) throw console.log("[ERROR]", err);
  })
}