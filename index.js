const net = require('net');

const newServer = ({ port, sessionHandler, dataHandler, endHandler }) => {

    const server = net.createServer(async function(socket) {

        //const sessionId = 'test';

        // notify new connection
        sessionHandler && sessionHandler(socket);

        // handle this connection
        socket.on('readable', async () => {
            let chunk;
            while (null !== (chunk = socket.read())) {
                // forward this chunk to the AV scanner
                await dataHandler(socket, chunk);
                // todo: handle backpressure - maybe this is already handled?
            }
        });
    
        socket.on('end', () => {
            socket.pipe(socket);
            endHandler(socket);
            // return {
            //     name: upload.name,
            //     is_infected: result.isInfected,
            //     viruses: result.viruses,
            //   };
        });

        socket.respond = async (data) => {
            socket.write(data);
        }
    });

    const start = async () => {
        const actualPort = port || 3310;
        server.listen(actualPort, '127.0.0.1');
        return { port: actualPort };
    };

    

    return {
        start: start
    };
}

module.exports = {
    newServer: newServer
};