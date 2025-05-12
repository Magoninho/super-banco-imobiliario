import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.ts";
import { db } from "./db.ts";

export const socketHandler = (io: Server) => {
    io.use(socketAuth);

    io.on('connection', (socket) => {
        const roomCode = socket.user.roomCode;
        // console.log("user connected: " + socket.user.username);
        socket.join(roomCode);
        socket.to(roomCode).emit("user_joined", (socket.user));

        db.prepare("UPDATE players SET active = 1 WHERE player_id = ?;")
            .run(socket.user.playerId);

        socket.on('disconnect', () => {
            socket.to(roomCode).emit('user_left', (socket.user));
            db.prepare("UPDATE players SET active = 0 WHERE player_id = ?;")
                .run(socket.user.playerId);
            console.log(socket.user.playerId);
        });
    });
};