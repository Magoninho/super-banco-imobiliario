import express from "npm:express";
import cors from 'cors';
import { db } from "./config/db.ts";
import { router as roomRouter } from './routes/roomRoutes.ts';
import 'dotenv/config';

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/room', roomRouter);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
