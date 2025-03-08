import express from "express";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoute);

export { app };
