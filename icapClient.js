const { Readable } = require('stream');
const net = require('net');
const fs = require('fs');

var client = new net.Socket();

client.connect(3310, '127.0.0.1', function() {
	console.log('Connected');
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
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

