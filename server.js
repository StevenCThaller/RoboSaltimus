require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const app = express();

require('./server/config/mongoose.config');

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true })
);

require('./server/routes/routes.js')(app)

const { client, onConnectHandler, messageHandler } = require('./server/controllers/client.controller');

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    client.connect();
    client.on('connected', onConnectHandler)
    client.on('message', messageHandler)
});

const io = require('socket.io')(server);

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("test", data => {
        console.log("no u");
        socket.emit("no u", "no u");
    })
})