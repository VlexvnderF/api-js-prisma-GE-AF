import express from "express";
import cors from "cors";
import { routes } from "./router";

require("dotenv").config();

export const app = express();

app.use(cors());
app.use(express.json());
routes(app);
