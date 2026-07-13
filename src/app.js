import express from "express";
import cors from "cors";
import identifyRouter from "./routes/identify.routes.js";
const app = express();

app.use(cors());

app.use(express.json());
app.use("/", identifyRouter);
export default app;
