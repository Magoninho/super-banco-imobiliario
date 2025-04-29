import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.ts";

export const socketHandler = (io: Server) => {
    io.use(socketAuth);

    io.on('connection', (socket) => {
        const roomCode = socket.user.roomCode;
        // console.log("user connected: " + socket.user.username);
        socket.join(roomCode);
        socket.to(roomCode).emit("user_joined", (socket.user));
        socket.on('disconnect', () => {
            socket.to(roomCode).emit('user_left', (socket.user));
        })
    });
};