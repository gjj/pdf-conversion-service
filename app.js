var gs = require('gs');


const fileName = "Certificate";

gs()
    .batch()
    .nopause()
    .option('-r' + 50 * 2)
    .executablePath('lambda-ghostscript/bin/gs')
    .device('png16m')
    .output('/tmp/' + fileName + '.png')
    .input('/tmp/' + fileName + '.pdf')
    .exec(function (err, stdout, stderr) {
        if (!err) {
           // no error
        } else {
           // handle errors
        }
    });