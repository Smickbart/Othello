const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "pug");
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("move", (moves) => {
        io.emit("update ui", moves);
    });
});

server.listen(3000, () => {
    console.log("Listening on port: 3000");
});