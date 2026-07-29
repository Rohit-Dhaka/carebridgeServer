import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import router from './routes/index.js';



const app = express();



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(morgan())
app.use(cookieParser())
app.use('/api' , router)



export default app;