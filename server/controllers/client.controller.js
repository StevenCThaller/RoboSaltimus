const User = require('../models/user');
const tmi = require('tmi.js');
const fs = require('fs');
const username = process.env.UNAME;
const password = process.env.PASSWORD;
const raw = fs.readFileSync('channels.json');
const { channels } = JSON.parse(raw);

const client = new tmi.client({
    identity: {
        username: username,
        password: password
    }, 
    channels: channels
});

const cmdParse = (cmd) => {
    return cmd.split(" ");
}   

const msgParse = (msg,context,channel) => {
    
    if(msg.includes("${user}")){
        while(msg.includes("${user}")){
            msg = msg.replace("${user}", context.username);
        }
    }

    if(msg.includes("${channel}")){
        while(msg.includes("${channel}")){
            msg = msg.replace("${channel}", channel);
        }
    }
    
    return msg;
}

module.exports = {
    client: client,
    onConnectHandler: (addr, port) => console.log(`Connected to ${addr}:${port}`), 
    messageHandler: (target, context, msg, self) => {
        if(self)  return;
        
        
        const command = msg.trim().toLowerCase();
        if(command[0] != "!") return;

        const prefix = command.split(" ")[0];

        console.log("Prefix is ", prefix);
        console.log(command === prefix);


        User.findOne({ channel: target })
            .then(data => {
                let pair = {
                    command: 'quitopolis',
                    message: 'quitopolis'
                }
                data.commands.some(cmd => cmd.command.includes(prefix) ? pair = { command: cmd.command, message: cmd.message }: '')
                
                if(pair.message == 'quitopolis') return;

                if(prefix === command)
                    client.say(target, msgParse(pair.message,context,target));
                else {
                    let cmd = cmdParse(command);
                    let pCmd = cmdParse(pair.command);
                    let newMsg = pair.message;
                    for(let i = 1; i < cmd.length; i++){
                        while(newMsg.includes(pCmd[i])){
                            newMsg = newMsg.replace(pCmd[i], cmd[i]);
                        }
                    }
                    client.say(target, newMsg);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}
