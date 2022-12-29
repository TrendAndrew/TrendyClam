
# TrendyClam

![TrendyClam](https://github.com/TrendAndrew/TrendyClam/blob/main/img/clam612.jpeg)

## What is it?

TrendClam is a swap out replacement for ClamAv that utilises Trend Micro capabilities for more advanced enterprise level AV scanning.

It's been designed to essentially replace an existing ClamAV server (meaning you can completely remove it) and drop this in it's place. By simply configuring the service to point to an appropriate Trend Micro product (via iCAP submission to SWG, ServerProtect, DDAN or similar) you can make use of your Trend Micro advanced AV and XDR capabilities and simplify your environment by removing a single point product.

TrendyClam is built using the <a href="https://www.npmjs.com/package/@anamico/musselav" target="musselav">@anamico/musselav</a> library to emulate a ClamAV tcp service. 

## Installation

1. Clone the repo to a local server.
2. Copy <b>config-default.json</b> to <b>config.json</b>
3. Edit <b>config.json</b> and set the ip/host and port for your ServerProtect for Storage iCAP server
4. Install pm2
5. Run the server.js as a pm2 service.
