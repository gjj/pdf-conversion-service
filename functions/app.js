const fs = require("fs");
const gs = require("gs");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucket = storage.bucket("my-little-bucket-1");

exports.convertPDFtoImage = (file, context) => {
  // console.log(`  Event: ${context.eventId}`);
  // console.log(`  Event Type: ${context.eventType}`);
  // console.log(`  Bucket: ${file.bucket}`);
  // console.log(`  File: ${file.name}`);
  // console.log(`  Metageneration: ${file.metageneration}`);
  // console.log(`  Created: ${file.timeCreated}`);
  // console.log(`  Updated: ${file.updated}`);
  // console.log(`  Size: ${file.size}`);
  // console.log(`  Content Type: ${file.contentType}`);
  // console.log(`  Storage Class: ${file.storageClass}`);

  const fileName = file.name;
  const fileType = file.contentType;
  const fileExtension = fileName
    .split(".")
    .pop()
    .toLowerCase();
  const fileNameNoExtension = fileName.split(".").shift();
  const newFileName = `${fileNameNoExtension}.png`;

  bucket
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
    });
  // bucket
  //   .file(fileName)
  //   .download({
  //     destination: `/tmp/${fileName}`
  //   })
  //   .then(() => {
  //     // Image downloaded, now convert to PNG
  //     console.log(`Image successfully downloaded to /tmp/${fileName}`);

  //     if (fs.existsSync(`/tmp/${fileName}`)) {
  //       console.log("File downloaded successfully from GCS.");
  //     }

  //     return new Promise((resolve, reject) => {
  //       gs()
  //         .batch()
  //         .nopause()
  //         .option(`-r${50 * 2}`)
  //         .executablePath("ghostscript/bin/gs")
  //         .device("png16m")
  //         .output(`/tmp/${newFileName}`)
  //         .input(`/tmp/${fileName}`)
  //         .exec(err => {
  //           if (!err) {
  //             // gs executed without error.
  //             console.log(
  //               `GhostScript successfully converted to PNG at /tmp/${newFileName}`
  //             );
  //             resolve();
  //           } else {
  //             reject(err);
  //           }
  //         });
  //     })
  //       .then(() => {
  //         // Image converted, now upload to Google Cloud Storage

  //         return bucket
  //           .upload(`/tmp/${newFileName}`, {
  //             destination: `${newFileName}`
  //           })
  //           .then(() => {
  //             // Image uploaded, now delete the original PDF
  //             console.log("Image uploaded to GCS");
  //             return bucket.file(fileName).delete();
  //           });
  //       })
  //       .then(() => {
  //         console.log("Deleting the temporary files");
  //         // All done, now delete temporary file
  //         fs.unlinkSync(`/tmp/${fileName}`);
  //         fs.unlinkSync(`/tmp/${newFileName}`);
  //       });
  //   })
  //   .catch(err => {
  //     return err;
  //   });
};
