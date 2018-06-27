"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const btt_node_1 = require("btt-node");
// initialize main BTT instance
const btt = new btt_node_1.BTT({
    domain: "127.0.0.1",
    port: 64472,
    protocol: "http",
    sharedKey: "testkey"
});
// get existing touch bar widget
const touchBarWidget = new btt.Widget({
    // uuid of the tb widget, you can PPM it and copy from within BTT
    uuid: "92751FE9-92FD-43E0-9304-5E57344EE3F2",
    // default value used for updating the widget contents without arguments
    default: () => {
        return {
            // the text that you want to set to your widget
            text: "Default: " + new Date()
        };
    }
});
setInterval(() => {
    touchBarWidget.update();
}, 1000);
const writeSongTitle = title => { };
//# sourceMappingURL=touchbar.js.map