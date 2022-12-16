
const musselAV = require('../index.js');

const dataHandler = async (session, chunk) => {
    console.log('data (' + session + '): ', chunk);
};

const endHandler = async (session) => {
    console.log('end');
    const result = {
        name: 'upload.name',
        is_infected: 'result.isInfected',
        viruses: 'result.viruses'
    }
    session.respond(JSON.stringify(result, null, 2));
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

