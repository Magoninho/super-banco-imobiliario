import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.ts";
import { db } from "./db.ts";
import { addPlayerMoney } from "../controllers/playerController.ts";


interface MoneySocketData {
    type: string,
    value: number,
    user: User
};

export const socketHandler = (io: Server) => {
    io.use(socketAuth);

    io.on('connection', (socket) => {
        const roomCode = socket.user.roomCode;
        // console.log("user connected: " + socket.user.username);
        socket.join(roomCode);
        socket.to(roomCode).emit("user_joined", (socket.user));

        // setting the player as active
        db.prepare("UPDATE players SET active = 1, socket_id = ? WHERE player_id = ?;")
            .run(socket.id, socket.user.playerId);

        
        socket.on("submission", (data: MoneySocketData) => {
            // 1. verify if its a number
            // 2. find out the admin socket id by consulting the database
            // 3. send a "request-approval" like message to the admin only (with the type in the data)
            // 4. in the frontend, the admin can either accept or deny the request
            // 4.1. if it denies, it will send a "response-deny" message
            // 4.2. the user will receive the message, that will be translated into a pop up
            // 5. if the admin approves, it will send a "response-accept" message
            // 6. the database will be updated with the new amount of money for the user who made the request
            // 7. the user will receive a pop up alert saying that he got approved by the admin
            const currentPlayerId = socket.user.playerId;
            
            const numberValue = Number(data.value);
            
            if (isNaN(numberValue)) {
                socket.to(data.user.socket_id).emit("submission-response", {
                    success: false,
                    error: "Inputed value is not a number!"
                });
                return;
            }
            
            // find the admin in the room using the room code
            // deno-lint-ignore no-explicit-any
            const admin: any = db.prepare(`
                SELECT socket_id 
                FROM players 
                INNER JOIN rooms 
                ON players.room_id = rooms.room_id AND rooms.room_code = ? AND players.admin = 1;`)
                    .get(roomCode);
            
            
            if (socket.id == admin.socket_id) {
                if (data.type == "receive") {
                    addPlayerMoney(currentPlayerId, numberValue);
                } else {
                    addPlayerMoney(currentPlayerId, -numberValue)
                }

                io.to(socket.id).emit("admin-update");
                return;
            }
            
            socket.to(admin.socket_id).emit("request-approval", {...data, user: socket.user});
        });
        
        socket.on("response-accept", (data) => {
            const user = db.prepare(`
                SELECT socket_id FROM players WHERE player_id = ?;`).get(data.user.playerId);
            socket.to(user.socket_id).emit("status-update", {
                ...data,
                response: "accept",
            });
            
            // very hard coded, sorry. ill refactor this later
            if (data.type == "receive") {
                addPlayerMoney(data.user.playerId, data.value);
            } else {
                addPlayerMoney(data.user.playerId, -data.value);
            }
        });
        
        socket.on("response-deny", (data) => {
            const user = db.prepare(`
                SELECT socket_id FROM players WHERE player_id = ?;`).get(data.user.playerId);
            socket.to(user.socket_id).emit("status-update", {
                ...data,
                response: "deny",
            });
        })

        socket.on('disconnect', () => {
            socket.to(roomCode).emit('user_left', (socket.user));
            // setting player as unactive
            db.prepare("UPDATE players SET active = 0 WHERE player_id = ?;")
                .run(socket.user.playerId);
        });
    });
};