import express from "npm:express";
import { createTables } from "./config/db.ts";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  createTables();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
