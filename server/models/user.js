const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');

const CommandSchema = require('./command');

const UserSchema = new mongoose.Schema({
    uname: { 
        type: String,
        required: [true, "Username is required."],
        minlength: [4, "Username must be at least 4 characters long."],
        maxlength: [25, "Username cannot be longer than 25 characters in length."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        validate: {
            validator: v => {
                let re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                return re.test(v);
            },
            message: "Please enter a valid email address."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be at least 8 characters in length."],
        maxlength: [127, "Ok that's overkill."]
    },
    channel: {
        type: String,
        required: [true, "You can't use RoboSaltimus without a channel!"], 
        index: true
    },
    commands: [CommandSchema],
    raid: {
        type: String,
        defualt: "Thanks for the raid!"
    }
}, { timestamps: true});


// Virtual attribute for password confirmation
UserSchema.virtual('confirmPassword')
    .get( () => this._confirmPassword)
    .set(value => this._confirmPassword = value);

// Validating that the password field and the confirm password fields match
UserSchema.pre('validate', function(next) {
    if(this.password !== this.confirmPassword){
        this.invalidate('confirmPassword', 'Passwords must match.');
    }
    next();
});

// After making sure the user's login info matches our schema,
// and prior to saving it into the database, we want to encrypt that password
UserSchema.pre('save', function(next) {
    this.channel = `#${this.channel}`;

    const raw = fs.readFileSync('channels.json');
    const { channels } = JSON.parse(raw);

    channels.push(this.channel);

    fs.writeFileSync('channels.json', JSON.stringify({channels}, null, 2));


    bcrypt.hash(this.password, 9)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => console.log(err));
});

module.exports = new mongoose.model("User", UserSchema);