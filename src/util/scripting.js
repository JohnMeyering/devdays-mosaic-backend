import { exec } from "child_process";

// Return a promise with the return code.
export function ExecAsync(paramString) {
  return new Promise((resolve, reject) => {
    exec(paramString, (error, stdout, stderr) => {
      console.log(`INFO: Running ${paramString}`);
      console.log(`INFO: stdout: ${stdout}`);
      console.log(`INFO: stderr: ${stderr}`);

      if (error !== null) {
          console.log(`ERROR: exec error: ${error}`);
          return reject(error);
      }

      resolve();
    })
  })
}