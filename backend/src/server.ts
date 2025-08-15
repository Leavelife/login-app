import {Elysia} from "elysia"
import { userRoute } from "./routes/userRoute"
import { cookie } from "@elysiajs/cookie"
import cors from "@elysiajs/cors"
import dotenv from "dotenv"

dotenv.config();

const app = new Elysia()
    .use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .use(cookie())
    .get("/", () => ({message: "API is running"}));

userRoute(app);

app.listen(3000);
console.log("server running at http://localhost:3000")