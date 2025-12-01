import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Create Database Connection  */

import db from "./config/db.js";
/**Make Database Connection Avaiable in globally */
global.db = db;
/** */

// Simple Route to Check Server
app.get("/", (req, res) => {
  res.send("Hello Task Manager Backend Server is Running...");
});

/**Call Routes.. */

import aboutCounting from "./routes/aboutCounting.js";

app.use("/aboutCounting", aboutCounting);

/**---------------Start Server ---------------*/
// app.listen(port, () => {
//   console.log(`Server Running On Port: ${port}`);
// });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Running On Port: ${port}`);
});
