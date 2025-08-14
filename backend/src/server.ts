import {Elysia} from "elysia"
import { userRoute } from "./routes/userRoute"
import { cookie } from "@elysiajs/cookie"
import cors from "@elysiajs/cors"
import dotenv from "dotenv"

dotenv.config();

const app = new Elysia()
    .use(cors())
    .use(cookie())
    .get("/", () => ({message: "API is running"}));

userRoute(app);

app.listen(3000);
console.log("server running at http://localhost:3000")