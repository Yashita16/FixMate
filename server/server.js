import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();


const app=express();

app.get('/',(req,res)=>{
  res.send('API IS WORKING');
   
})

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

const connectDb=async()=>{
  await mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Db connected")).catch(err=>console.log(err));
}

connectDb();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.listen(4000,()=>{
  console.log("app is working on port 4000")
})