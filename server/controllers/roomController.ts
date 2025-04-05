// deno-lint-ignore-file
// @ts-ignore
// @ts-types="npm:@types/express"
import jwt from "jsonwebtoken";
import process from "node:process";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import express, { Request, Response } from "npm:express";
import { body, validationResult } from "express-validator";
import { db } from "../config/db.ts";

interface Room {
  room_id: number,
  roomName: string,
  roomCode: string,
  password: string
}

function generateRandomCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }

  const randomNumber = Math.floor(Math.random() * 10);
  result += randomNumber;

  return result;
}

export const createRoom = async (req: Request, res: Response) => {
  // making form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, roomName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password);

  try {
    let roomCode = generateRandomCode();
    // checking if random code already exists in the database
    while (
      db.prepare("SELECT * FROM rooms WHERE room_code = ?").all(roomCode)
        .length > 0
    ) {
      roomCode = generateRandomCode();
    }

    const roomId = db
      .prepare(
        `
            INSERT INTO rooms (room_name, room_code, password) VALUES (?, ?, ?);
            `
      )
      .run(roomName, roomCode, hashedPassword)["lastInsertRowid"];

    const playerId = db
      .prepare(
        `INSERT INTO players (nickname, admin, room_id) VALUES (?, ?, ?);`
      )
      .run(username, 1, roomId)["lastInsertRowid"];

    // JWT token sign
    const token = jwt.sign(
      {
        playerId,
        roomCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      roomCode,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while trying to access the database");
  }
};

export const joinRoom = async (req: Request, res: Response) => {
	// join room (nickname, room code, password)
	//     create token, insert user on the database
	// -> token

  // making form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, roomCode, password } = req.body;

    const room: Room = db.prepare(`SELECT room_id, password FROM rooms WHERE room_code = ?;`).get(roomCode) as Room;
  
    const isMatch = await bcrypt.compare(password, room.password);
  
    // if the password matches
    if (isMatch) {
      // insert user on the database
      const playerId = db
        .prepare(
          `INSERT INTO players (nickname, admin, room_id) VALUES (?, 0, ?);`
        )
        .run(username, room.room_id)["lastInsertRowid"];
        
        // JWT token sign
      const token = jwt.sign(
        {
          playerId,
          roomCode,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        token,
        roomCode
      });
  
    } else {
      throw "Wrong password";
    }
  
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error: " + err)
  }
};

export const getPlayers = (req: Request, res: Response) => {
    // SELECT nickname FROM players WHERE room_id = (SELECT room_id FROM rooms WHERE room_code = "JASB2");
    //   let roomCode: string = req.query.roomCode;
    const { roomCode } = req.query;
  
    if (roomCode) {
      let players = db.prepare(
          `
                SELECT * FROM players WHERE room_id = (SELECT room_id FROM rooms WHERE room_code = ?);
              `
        )
        .all(roomCode as string);
  
      return res.status(200).send(players);
    }
  
    return res.status(200).send(
      db.prepare("SELECT * FROM players;")
        .all()
    );
  }