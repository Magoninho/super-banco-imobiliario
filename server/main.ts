import express from "npm:express";
import cors from 'cors';
import { db } from "./config/db.ts";
import { router as roomRouter } from './routes/roomRoutes.ts';
import { router as playerRouter } from './routes/playerRoutes.ts';
import 'dotenv/config';
import { Server } from "socket.io";
import { createServer } from "node:http";
import { socketHandler } from "./config/socketHandler.ts";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

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