import express, { Request, Response } from "npm:express";
import { db } from "../config/db.ts";
import { getPlayerInfo } from "../controllers/playerController.ts";

export const router = express.Router();

router.get('/get-player-info', getPlayerInfo);