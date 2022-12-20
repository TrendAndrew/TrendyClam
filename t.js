const icap = require("./icapClient");

const responseHandler = async (client, response) => {
    console.log('responseHandler:', response);
};

icap.connect({
    host: '192.168.100.132',
    port: 1344,
    responseHandler: responseHandler
}).then(({sendHeader, sendData}) => {
    console.log('icap connection returned');
    sendHeader({
       "Content-Length" : 67
    });
    //sendData("blah blah blah");
    sendData("X5O!P%@AP[4\PZX54(P^)7CC)7}$");
    sendData("EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*");
    sendData(null);
});