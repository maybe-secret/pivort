import express from "express";
import cors from "cors";
import config from "./config/index.js";


const app = express();

app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: config.cors.methods,
}))

// Body parsing middlewares
app.use(express.json({ limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "10mb"}));

// Routes
app.get("/test", (req, res) => {
    return res.status(200).json({ success: true, message: "routes working"});
})


// Default Route
app.get("*splat", (req, res) => {
    return res.status(404).json({ success: false, message: `Can not find the resource ${req.originalUrl}` });
})

export default app;
