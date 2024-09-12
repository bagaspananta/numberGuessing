// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create Express App
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

let randomNumber = Math.floor(Math.random() * 100) + 1;
let players = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New player connected: ' + socket.id);
    
    players.push(socket.id);
    
    socket.emit('message', 'Welcome to the Guessing Game!');
    socket.broadcast.emit('message', `Player ${socket.id} has joined.`);

    socket.on('guess', (guess) => {
        if (guess == randomNumber) {
            io.emit('message', `Player ${socket.id} guessed the number ${randomNumber}! They win!`);
            randomNumber = Math.floor(Math.random() * 100) + 1;  // Reset number after a win
        } else if (guess < randomNumber) {
            socket.emit('message', 'Too low!');
        } else {
            socket.emit('message', 'Too high!');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected.`);
        players = players.filter(player => player !== socket.id);
        io.emit('message', `Player ${socket.id} has left.`);
    });
});

server.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});
