const { Readable } = require('stream');
const net = require('net');
const fs = require('fs');

const connect = async ({ host, port }) => {
    const client = new net.Socket();

    client.connect(port, host, function() {
        console.log('iCap connected');
        const stream = new Readable();
        //client.pipe(stream);
        var file = fs.createReadStream('eicar.txt');
        file.on('open', function () {
            var transfer = file.pipe(client, {end:false});
            transfer.on('end', () => {
                console.log('file sent');
                client.write('fred');          // send a file terminator
                client.destroy();
            });
        });
    });
    
    client.on('data', function(data) {
        console.log('iCap received: ' + data);
        client.destroy(); // kill client after server's response
        // this connection is now invalid
    });
    
    client.on('close', function() {
        console.log('iCap closed');
    });

    return {
        

    }
}





module.exports = {
    connect: connect
}