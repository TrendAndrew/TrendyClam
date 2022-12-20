
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

var sessions = {};

const dataHandler = async (session, chunk) => {

    console.log('dataHandler: ', session, chunk.toString());
    
    const stream = sessions[session] || temp.createWriteStream();
    stream.write(chunk);
    sessions[session] = stream;
};

const endHandler = async (session) => {
    console.log('input end');
    const stream = sessions[session] || temp.createWriteStream();
    const path = stream.path;
    stream.end();
 
     // create an iCap session, send the file and get the response
    const {sendHeader, sendData} = await iCapClient.connect({
        host : config.host || '127.0.0.1',
        port : config.port || 3310,
        responseHandler: async (icapResult) => {
            console.log('iCap result:', icapResult);
            // respond to the calling process
            const result = {
                is_infected: 'result.isInfected',
                viruses: 'result.viruses'
            }
            session.respond(result);
        }
    });

    const stats = fs.statSync(path)
    await sendHeader({
        "Content-Length" : stats.size
    });
    
    const readStream = fs.createReadStream(path, { encoding: "binary" });

    readStream.on("data", (chunk) => {
      sendData(chunk);
    });

    readStream.on("end", () => {
        sendData(null);
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

