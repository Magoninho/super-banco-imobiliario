import express, { Request, Response } from "npm:express";
import { db } from "../config/db.ts";


export const getPlayerInfo = async (req: Request, res: Response) => {
    const { playerId } = req.query;

    if (!playerId) {
        return res.status(400).json({ 
            error: "Missing required parameter: playerId" 
        });
    }

    let player = db.prepare(`SELECT * FROM players WHERE player_id = ?;`)
        .all(playerId as string);

    if (player.length === 0) {
        return res.status(404).json({
            error: "Player not found" 
        });
    }

    return res.status(200).json(player[0]);
    
}