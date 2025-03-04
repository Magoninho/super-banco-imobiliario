import express, { RequestHandler, RequestParamHandler } from 'npm:express';
import { db } from '../config/db.ts';
import jwt from 'jsonwebtoken';
import process from "node:process";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { body, validationResult } from 'express-validator';

export const router = express.Router();

const verifyToken: RequestParamHandler = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Token invalido' });
	}
};

function generateRandomCode(): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';

	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * letters.length);
		result += letters[randomIndex];
	}

	const randomNumber = Math.floor(Math.random() * 10);
	result += randomNumber;

	return result;
}


// TODO: implement ZOD to validade stuff being sent
router.post('/create', [
	body('username').trim().notEmpty().withMessage("username is required"),
	body('roomName').trim().notEmpty().withMessage("room name is required"),
	body('password').isLength({min: 3}).withMessage("password should be at least 6 characters long")
], async (req, res) => {
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
		while (db.prepare('SELECT * FROM rooms WHERE room_code = ?').all(roomCode).length > 0) {
			roomCode = generateRandomCode();
		}

		const roomId = (db.prepare(
			`
			INSERT INTO rooms (room_name, room_code, password) VALUES (?, ?, ?);
			`,
		).run(roomName, roomCode, hashedPassword))['lastInsertRowid'];

		const playerId = (db.prepare(
			`INSERT INTO players (nickname, admin, room_id) VALUES (?, ?, ?);`
		).run(username, 1, roomId))['lastInsertRowid'];

		// JWT token sign
		const token = jwt.sign({
			playerId
		}, process.env.JWT_SECRET, { expiresIn: '10s' });

		res.status(200).json({
			token,
			roomCode
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Error while trying to access the database");
	}
});

router.get('/verify-token', verifyToken as RequestHandler, (req, res) => {
	res.status(200).json({
		message: 'Token valido'
	})
});