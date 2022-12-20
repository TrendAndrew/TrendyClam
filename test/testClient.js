const { Readable } = require('stream');
const net = require('net');
const fs = require('fs');

var client = new net.Socket();
client.connect(3310, '127.0.0.1', function() {
    console.log('Connected');
    const stream = new Readable();
    var file = fs.readFileSync('eicar.txt');
    stream.push(file);
    stream.push(null);
    stream.pipe(client);
});

client.on('data', function(data) {
    const result = JSON.parse(data);
	console.log('Result:', result);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
