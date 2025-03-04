import express, { RequestHandler, RequestParamHandler } from 'npm:express';
import { db } from '../config/db.ts';
import jwt from 'jsonwebtoken';
import process from "node:process";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

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


router.post('/create', async (req, res) => {

	const { roomName, password } = req.body;
	const hashedPassword = await bcrypt.hash(password);

	try {
		let roomCode = generateRandomCode();
		// checking if random code already exists in the database
		while (db.prepare('SELECT * FROM rooms WHERE room_code = ?').all(roomCode).length > 0) {
			roomCode = generateRandomCode();
		}

		db.prepare(
			`
			INSERT INTO rooms (room_name, room_code, password) VALUES (?, ?, ?);
			`,
		).run(roomName, roomCode, hashedPassword);

		const { room_id } = db.prepare('SELECT room_id FROM rooms WHERE room_code = ?').get(roomCode);

		const playerId = (db.prepare(
			`INSERT INTO players (nickname, has_set_nickname, admin, room_id) VALUES (?, ?, ?, ?);`
		).run("Guest", 0, 1, room_id))['lastInsertRowid'];



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