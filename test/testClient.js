const clamd = require('clamdjs');
const scanner = clamd.createScanner('127.0.0.1', 3310);
var temp = require('temp');

// Automatically track and cleanup files at exit
temp.track();

const runTest = async () => {
    // build a temp eicar file (do this dynamically in case you have a virus scanner installed,
    // don't want it to delete the file before we can run the test)
    const tempFile = temp.createWriteStream();
    const path = tempFile.path;
    await tempFile.write("X5O!P%@AP[4\PZX54(P^)7CC)7}$" + "EICAR-STA NDARD-ANTIVIRUS-TEST-FILE!$H+H*");
    await tempFile.end();

    scanner.scanFile(path, 3000, 1024 * 1024)
        .then((reply) => {
            console.log('reply: ', reply);
            // print some thing like
            // 'stream: OK', if not infected
            // `stream: ${virus} FOUND`, if infected
        })
        .catch((error) => {
            console.error('error: ', error);
        });
}

runTest();