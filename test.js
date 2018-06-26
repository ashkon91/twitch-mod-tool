var tmi = require("tmi.js");

var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "Ashkon",
        password: "oauth:vi7ocq91rskklxv8gb8ze8szzc9ir7"
    },
    channels: ["#Shroud"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();
console.log("CONNECTED");
console.log(client.getChannels());
console.log(client.getUsername());
var count = 0
client.on("message", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Handle different message types..
    switch(userstate["message-type"]) {
        case "action":
            // This is an action message..
            break;
        case "chat":
            // This is a chat message..
            console.log("CHAT MESSAGE");
            count = count + 1
            console.log(count);
            break;
        case "whisper":
            // This is a whisper..
            break;
        default:
            // Something else ?
            break;
    }
});