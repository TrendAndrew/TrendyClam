
const musselAV = require('../index.js');

const dataHandler = async (session, chunk) => {
    console.log('data (' + session + '): ', chunk);
};

const endHandler = async (session) => {
    console.log('end');
    session.respond('{\r\n}\r\n');
};

const server = musselAV.newServer({
    // port: 3310,              // default
    // sessionHandler: null,    // default
    dataHandler: dataHandler,
    endHandler: endHandler
});

server.start().then(({ port }) => {
    console.log('example MusselAV server running on localhost:3310');
});

