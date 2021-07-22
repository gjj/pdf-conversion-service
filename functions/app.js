const fs = require("fs");
const gs = require("gs");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucket = storage.bucket("my-little-bucket-1");

exports.convertPDFtoImage = (file, context) => {
  const fileName = file.name;
  const fileType = file.contentType;
  const fileExtension = fileName
    .split(".")
    .pop()
    .toLowerCase();
  const fileNameNoExtension = fileName.split(".").shift();
  const newFileName = `${fileNameNoExtension}.png`;

  // If content type isn't pdf or file extension doesn't end with .pdf, no point converting
  if (fileType !== "application/pdf") return false;
  if (fileExtension !== "pdf") return false;

  return bucket
    .file(fileName)
    .download({
      destination: `/tmp/${fileName}`
    })
    .then(() => {
      // Image downloaded, now convert to PNG
      console.log(`Image successfully downloaded to /tmp/${fileName}`);

      if (fs.existsSync(`/tmp/${fileName}`)) {
        console.log("File downloaded successfully from GCS.");
      }

      return new Promise((resolve, reject) => {
        gs()
          .batch()
          .nopause()
          .option(`-r${50 * 2}`)
          .executablePath("ghostscript/bin/gs")
          .device("pngalpha")
          .output(`/tmp/${newFileName}`)
          .input(`/tmp/${fileName}`)
          .exec(err => {
            if (!err) {
              // gs executed without error.
              console.log(
                `GhostScript successfully converted to PNG at /tmp/${newFileName}`
              );
              resolve();
            } else {
              console.log("GhostScript error", err);
              reject(err);
            }
          });
      });
    })
    .then(() => {
      // Image converted, now upload to Google Cloud Storage

      return bucket
        .upload(`/tmp/${newFileName}`, {
          destination: `${newFileName}`
        })
        .then(() => {
          // Image uploaded, now delete the original PDF
          console.log("Image uploaded to GCS");
          return bucket.file(fileName).delete();
        });
    })
    .then(() => {
      console.log("Deleting the temporary files");
      // All done, now delete temporary file
      fs.unlinkSync(`/tmp/${fileName}`);
      fs.unlinkSync(`/tmp/${newFileName}`);
    })
    .catch(err => {
      return err;
    });
};
