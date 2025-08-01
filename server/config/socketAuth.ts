import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io";


export const socketAuth = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        next(new Error("No token provided"));
    }
    
    try {
        const decoded = jwt.verify(token, Deno.env.get("JWT_SECRET"));
        socket.user = decoded;
    } catch (err) {
        next(new Error("Invalid token" + (err as Error).message));
    }
    
    return next();
};