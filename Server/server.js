import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { dataBase } from './config/db.js'
import { userRouter } from './routes/Auth.Route.js'


const app = express()
const PORT = process.env.PORT || 3000
dataBase()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); // for form data

// app.use(cors({origin : allowedOrigins , credentials : true}))
app.get("/",(req,res)=>{
    res.send("Welcome to my page")
})


app.use("/api/auth",userRouter)
// app.use("/api/users" , userRoute)
// app.use("/api/taks" , taskRoute)
// app.use("/api/reports" , reportRoute)
app.listen(PORT , () =>{
    console.log(`server is running on port : ${PORT}`)
})