import { db } from "../config/db.ts";
import { body, validationResult } from "express-validator";
import express, { RequestHandler, Request, Response } from "npm:express";
import { createRoom, getPlayers, joinRoom } from "../controllers/roomController.ts";

import { verifyToken } from "../middleware/verifyToken.ts";

export const router = express.Router();

// TODO: implement ZOD to validade stuff being sent
router.post("/create",
  [
    body("username").trim().notEmpty().withMessage("username is required"),
    body("roomName").trim().notEmpty().withMessage("room name is required"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password should be at least 6 characters long"),
  ], 
  createRoom
);

router.get("/get-players", getPlayers);

router.get("/verify-token", verifyToken as RequestHandler, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Token valido",
  });
});
