import fs from "fs";

export function MoveFile(source, destination) {
  fs.rename(source, destination, function (err) {
    if (err) throw console.log("[ERROR]", err);
  })
}

export async function DeleteFile(source) {
  return new Promise((resolve, reject) => {
    fs.unlink(source, (err) => {
      if (err) {
        throw console.log("[ERROR]", err); 
      }
    });

    resolve();
  });
}

export async function CreateDirectory(path) {
  return new Promise((resolve, reject) => {
    console.log(`Creating directory at ${path}`);
    fs.mkdir(path, (err) => {
      if (err) {
        throw console.log("[ERROR]", err); 
      }
    });
    console.log(`Done at ${path}`);

    resolve();
  });
}