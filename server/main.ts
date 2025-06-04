import express from "npm:express";
import cors from 'cors';
import { db } from "./config/db.ts";
import { router as roomRouter } from './routes/roomRoutes.ts';
import { router as playerRouter } from './routes/playerRoutes.ts';
import 'dotenv/config';
import { Server } from "socket.io";
import { createServer } from "node:https";
import fs from "node:fs";
import { socketHandler } from "./config/socketHandler.ts";
import path from "node:path";

const PORT = 3000;
const decoder = new TextDecoder("utf-8");
const privateKey = Deno.readFileSync(path.join(import.meta.dirname as string, 'cert', 'key.pem'));
const certificate = Deno.readFileSync(path.join(import.meta.dirname as string, 'cert', 'certificate.pem'));


const app = express();
const httpServer = createServer({
  key: decoder.decode(privateKey),
  cert: decoder.decode(certificate)
}, app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/room', roomRouter);
app.use('/player', playerRouter);


socketHandler(io);

httpServer.listen(3000, () => {
	console.log('App listening on port ' + 3000);
});