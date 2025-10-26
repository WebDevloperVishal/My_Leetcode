import express from "express"; 
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
                                                                                                                                                                                                                                                                                                                                                                                       
dotenv.config({ path: {debug: true} });

const app = express();

const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({ 
        success: true ,
        message: "Welcome to leetcode api"
    })
})

app.use("/api/v1/auth" , authRouter);

app.listen(PORT, () =>{ 
    console.log(`Example app listening at http://localhost:${PORT}`)
})