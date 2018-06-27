"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const client = new websocket_1.w3cwebsocket("ws://localhost:5672");
const TIMEOUT = 1000;
const TOKEN_PATH = path.join(__dirname, "token.txt");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const state = {
    playing: false,
    currentTrack: "",
    token: ""
};
const Channels = {
    PlayState: "playState",
    Track: "track",
    Time: "time",
    Rating: "rating",
    Shuffle: "shuffle",
    Repeat: "repeat",
    Connect: "connect"
};
const send = object => client.send(JSON.stringify(object));
client.onopen = () => {
    fs.readFile(TOKEN_PATH, (err, data) => {
        if (err && err.code === "ENOENT") {
            console.log("No token file, initializing!");
        }
        else {
            if (data) {
                state.token = data.toString();
            }
        }
        if (state.token) {
            send({
                namespace: "connect",
                method: "connect",
                arguments: ["gpmdp-touchbar", state.token]
            });
        }
        else {
            send({
                namespace: "connect",
                method: "connect",
                arguments: ["gpmdp-touchbar"]
            });
        }
    });
};
client.onmessage = function (e) {
    if (!e.data) {
        return;
    }
    const { channel, payload } = JSON.parse(e.data);
    switch (channel) {
        case Channels.Connect:
            if (payload === "CODE_REQUIRED") {
                rl.question("Input code you see in GPMDP: ", value => {
                    send({
                        namespace: "connect",
                        method: "connect",
                        arguments: ["gpmdp-touchbar", value]
                    });
                    rl.close();
                });
            }
            else {
                if (payload) {
                    state.token = payload;
                    fs.writeFile(TOKEN_PATH, payload, () => { });
                }
            }
            break;
        case Channels.PlayState:
            state.playing = payload;
            break;
        case Channels.Track:
            clearTimeout();
            if (state.playing) {
                state.currentTrack = `${payload.title} - ${payload.artist}`;
                // console.log(state.currentTrack);
            }
            else {
                state.currentTrack = "";
                console.log("Play");
            }
    }
};
//# sourceMappingURL=main.js.map