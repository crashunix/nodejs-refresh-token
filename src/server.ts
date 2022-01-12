import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes/api";

const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());
app.use(router);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.status(400).json({
        status: "Error",
        message: error.message
    })
});

app.listen(4000, () => console.log("Server is running on port 4000"));