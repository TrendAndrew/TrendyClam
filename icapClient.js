const { Readable } = require('stream');
const net = require('net');
const fs = require('fs');
const { createHash } = require('crypto');

const VERSION = '1.0';
const USER_AGENT = 'Javascript-ICAP-Client/1.1';
const END_LINE_DELIMITER = '\r\n';

const connect = ({ host, port, responseHandler }) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        const state = 'new';

        client.connect(port, host, function() {
            console.log('iCap connected');

            const preview = null;

            const reqHdr = "GET /origin-resource HTTP/1.1\r\n" +
                "Host: www.origin-server.com\r\n" +
                // "Accept: text/html, text/plain, image/gif\r\n" +
                // "Accept-Encoding: gzip, compress\r\n" +
                "\r\n";

            const reqHdrLen = reqHdr.length;

            var sentHeaders = false;

            const sendHeader = async (header) => {
                if (sentHeaders) {
                    return crash;
                }

                const date = new Date();

                const resHdr = "HTTP/1.1 200 OK\r\n" +
                "Date: Sun, 18 Dec 2022 09:52:22 GMT\r\n" +     // format date here?
                "Server: Apache/1.3.6 (Unix)\r\n" +
                'ETag: "63840-lab7-378d415b"\r\n' +
                // "Content-Type: text/html\r\n" +
                "Content-Type: *\r\n" +
                "Content-Length: " + header["Content-Length"] + "\r\n" +
                "\r\n";

                const resHdrLen = resHdr.length;
                const encapsulated = `req-hdr=0, res-hdr=${reqHdrLen}, res-body=${reqHdrLen + resHdrLen}`;

                const icapRequestHeader = 
                    "RESPMOD icap://" + host + "/SPFS-AV ICAP/"+VERSION+END_LINE_DELIMITER
                    + "Host: " + host + ":" + (port || 1344) +END_LINE_DELIMITER
                    // + "User-Agent: "+USER_AGENT+END_LINE_DELIMITER
                    // + "Allow: 204"+END_LINE_DELIMITER
                    // + (preview >= 0 ? ("Preview: "+preview+END_LINE_DELIMITER):"")
                    + "Encapsulated: " + encapsulated.toString() + END_LINE_DELIMITER
                    + END_LINE_DELIMITER;

                client.write(icapRequestHeader + reqHdr + resHdr);
                console.log("sent:", icapRequestHeader + reqHdr + resHdr);
                sentHeaders = true;
            };

            const sendData = async (data) => {
                if (!sentHeaders) {
                    return crash;
                }
                if (data === null) {
                    client.write('0' + END_LINE_DELIMITER + END_LINE_DELIMITER);
                    console.log("sent:", END_LINE_DELIMITER + '0' + END_LINE_DELIMITER + END_LINE_DELIMITER);
                    return
                }
                client.write(data.length.toString(16));
                client.write(END_LINE_DELIMITER);
                client.write(data);
                client.write(END_LINE_DELIMITER);
                console.log("sent:", data.length.toString(16), data + END_LINE_DELIMITER);
            };

            resolve({
                client: client,
                sendHeader: sendHeader,
                sendData: sendData
            });
        });
        
        client.on('data', function(data) {
            console.log('iCap received: ' + data);
            responseHandler(client, data.toString());
            client.destroy(); // kill client after server's response
            // this connection is now invalid
        });
        
        client.on('close', function() {
            console.log('iCap closed');
            responseHandler(client, null);
        });
    });
};


module.exports = {
    connect: connect
}