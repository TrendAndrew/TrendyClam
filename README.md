
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
4. Install nodejs and project dependencies
5. Install pm2
6. Run the server.js as a pm2 service.

### 1. Clone the repo to a local server

First you need to have git installed on the destination server: <a href="https://git-scm.com/downloads" target="git">https://git-scm.com/downloads</a>

Then you clone the trendyclam repository (repo) to a suitable local directory on the server:

```bash
git clone https://github.com/TrendAndrew/TrendyClam.git
```

### 2. Copy <b>config-default.json</b> to <b>config.json</b>

The repo has a default configuration file in it. You need to copy or rename it to config.json so the app can find it and load it.

### 3. Edit <b>config.json</b> and set the ip/host and port for your ServerProtect for Storage iCAP server

Edit the config.json file and use the IP address and port for your ServerProtect for Storage ICAP server.
At this stage you cannot set the NIC or port for accepting connections, these default to standard ClamAV 3310 port on all interfaces. If you need to lock down access, use firewall rules.

### 4. Install nodejs and project dependencies

Nodejs is a cross platform javascript code execution framework, It can be run on Windows/Linux/Mac etc.

Download the installer from <a href="https://nodejs.dev/" target="node">https://nodejs.dev/</a>, then follow the instructions to install it on the same server.

Once installed, it comes with npm (Node Package Manager), which is used to download dependencies for projects and other system capabilities.

Go to the directory of the project you downloaded in step 1, and use npm to install all the dependencies:
```bash
npm install
```

Note: at this stage you can run the TrendyClam server to test it out directly on the command line by issuing this command:
```bash
npm start
```

### 5. Install pm2

This is optional, but recommended.

pm2 provides a mechanism to turn any programs into system daemons. It's very straightforward to install and use and runs cross-platform also.

Instructions are here: <a href="https://pm2.keymetrics.io" target="pm2">https://pm2.keymetrics.io</a>.
Note that it is more Linux native, there are some specialised instructions to help working with PM2 on windows:
<a href="https://blog.cloudboost.io/nodejs-pm2-startup-on-windows-db0906328d75">https://blog.cloudboost.io/nodejs-pm2-startup-on-windows-db0906328d75</a>.

Essentially, you can install it for gloabl use using this command:
```bash
npm install pm2 -g
```

then, make sure you are inside the project directory you cloned in step one and issue:
```bash
pm2 start server.js
```

Check out the documentation for pm2 to set the service account or other configurations.

