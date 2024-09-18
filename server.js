// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create Express App
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let randomNumber = Math.floor(Math.random() * 100) + 1;
let players = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New player connected: ' + socket.id);

    // Ask for player name and store it
    socket.on('playerName', (name) => {
        players.push({ id: socket.id, name });
        io.emit('playersList', players);
        socket.emit('message', `Welcome, ${name}! Start guessing the number.`);
        socket.broadcast.emit('message', `${name} has joined the game.`);
    });

    socket.on('guess', (guess) => {
        const player = players.find(p => p.id === socket.id);
        if (player) {
            if (guess == randomNumber) {
                io.emit('winner', {
                    playerName: player.name,
                    winningNumber: randomNumber
                });
                randomNumber = Math.floor(Math.random() * 100) + 1;  // Reset the number
            } else if (guess < randomNumber) {
                io.emit('message', `${player.name} guessed too low.`);
            } else {
                io.emit('message', `${player.name} guessed too high.`);
            }
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(player => player.id !== socket.id);
        io.emit('playersList', players);
        io.emit('message', `Player ${socket.id} has left.`);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
