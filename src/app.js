import express from "express";
import authRoute from "./routes/auth.route.js";
import roomRoute from "./routes/room.route.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use("/room", roomRoute);

app.get("/", (_, res) => {
  res.send("Hello World");
});

export { app };
