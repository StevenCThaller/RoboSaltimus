const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
    command: {
        type: String,
        minlength: [2, "This command can't be shorter than 2 characters long."],
        index: true
    },
    message : {
        type: String,
        minlength: [5, "What's the point of having a bot yell out a message if you're gonna be lame and keep it so short."],
        maxlength: [400, "Twitch won't let you write anything longer than 500 characters in chat."]
    }
}, { timestamps: true })


module.exports = CommandSchema;