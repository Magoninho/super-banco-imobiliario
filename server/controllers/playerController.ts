import { Request, Response } from "npm:express";
import { db } from "../config/db.ts";
import jwt from "jsonwebtoken";

export const addPlayerMoney = (playerId: number, amount: number): boolean => {
  try {
    const player: any = db.prepare(`
        UPDATE players
        SET balance = balance + (?)
        WHERE player_id = ?;`)
      .run(amount, playerId);
    
    return true;
  } catch (error) {
    console.error(`Error adding ${amount} to player ${playerId}: ${error.message}`);
    return false;
  }
};

export const getPlayerInfo = (req: Request, res: Response) => {


    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, Deno.env.get("JWT_SECRET"));

        const { playerId } = decoded;

        // gets the player info, as well as the roomCode that he's in
        const player = db.prepare(`
                SELECT players.*, rooms.room_code FROM players 
                INNER JOIN rooms 
                ON rooms.room_id = players.room_id
                WHERE player_id = ?; 
            `)
            .all(playerId as string);

        if (player.length === 0) {
            res.status(404).json({
                error: "Player not found" 
            });
            return;
        }

        res.status(200).json(player[0]);
    } catch (err) {
        // Handle different types of JWT errors
        if (err instanceof Error) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            } else {
                console.error('Auth error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
        }
    }
    
}