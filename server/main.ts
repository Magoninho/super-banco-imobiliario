import express from "npm:express";
import { db } from "./config/db.ts";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
