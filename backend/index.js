import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import db from "./config/database.js"
import router from "./routes/index.js"

const app = express()
dotenv.config()
try {
    await db.authenticate()
    console.log('database terkoneksi...')
} catch (error) {
    console.log('database gagal terkoneksi...')
}

app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(3001, () => {
    console.log(`server berjalan...`)
})