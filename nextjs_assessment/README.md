# Project Components
1. Prepare your own Strapi V3.6.2
2. NodeJS 14.17.0
3. NPM 7.12.1
4. Yarn 1.22.5
5. sudo apt install build-essential
6. MongoDB 4.4.6
7. Debian 10

# Strapi setup
```
yarn create strapi-app backend
```
Choose Custom setting -> MongoDB
Apply database name and database host ip address

# Project setup
```
npm install
or
yarn install
```
I run my own service by create /lib/systemd/system/assessmentfrontend.service 
```
[Unit]
Description=Assessment Frontend System
After=network.target

[Service]
Environment=NODE_PORT=8001
Type=simple
User=wolverine
RestartSec=10
WorkingDirectory=/home/wolverine/production/assessment
ExecStart=/usr/bin/yarn dev
Restart=on-failure

[Install]
WantedBy=multi-user.target
``` 
Then...
```
sudo systemctl enable assessmentfrontend.service
sudo systemctl start assessmentfrontend.service
```
