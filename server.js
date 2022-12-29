
const musselAV = require('@anamico/musselav');
const fs = require("fs");
const iCapClient = require('./icapClient');
const config = require('./config.json');
var temp = require('temp');

// Automatically track and cleanup files at exit
// we have to use a temporary file to get the entire file contents as brain-dead
// iCap wants to know the file size up front, but clamAV doesn't, so we need to
// stage the file on local disk and can't just pass it through... Grrr....
temp.track();

var streams = {};

const dataHandler = async (session, chunk) => {    
    const stream = streams[session.id] || temp.createWriteStream();
    streams[session.id] = stream;

    console.log(`dataHandler: (${session.id} : ${stream.path})`, chunk);
    stream.write(chunk);
};

const endHandler = (session) => {
    return new Promise(async (resolve, reject) => {
        const stream = streams[session.id];
        if (!stream) { return; }
        const path = stream.path;
        console.log('input end', session.id, ':', 'written to', path);
        stream.end();
        delete streams[session.id];
    
        // create an iCap session, send the file and get the response
        const {sendHeader, sendData} = await iCapClient.connect({
            host : config.iCapHost || '127.0.0.1',
            port : config.iCapPort || 1344,
            responseHandler: async (client, icapResult) => {
                if (!icapResult) { return; }
                console.log('iCap result:', icapResult);
                // respond to the calling process
                const result = !icapResult.Virus_ID ? "OK" : `${icapResult.Virus_ID} FOUND`;
                await session.respond(result);
                resolve();
            }
        });

        const stats = fs.statSync(path)
        await sendHeader({
            "Content-Length" : stats.size
        });
        
        const readStream = fs.createReadStream(path, { encoding: "binary" });

        readStream.on("data", async (chunk) => {
            console.log(`send data to iCap (${path}): ${chunk.length} bytes`);
            await sendData(chunk);
        });

        readStream.on("end", async () => {
            console.log(`send null to iCap (${path})`);
            await sendData(null);
        });
    });
};

const server = musselAV.newServer({
    // port: 3310,              // default
    // sessionHandler: null,    // default
    dataHandler: dataHandler,
    endHandler: endHandler
});

server.start().then(({ port }) => {
    console.log('example MusselAV server running on localhost:3310');
}).catch((err) => {
    console.error(err);
});

