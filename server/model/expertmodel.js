import mongoose, { model } from "mongoose";

const expertSchema = new model.mongoose({
  name:{
    Type:String,
    required:true
  },
  email:{
    Type:String , 
    required:true
  },
  password:{
    Type:String,
    required:true
  },
  skills: [String],
  experience:{
    Type:Number,
    required:true
  },
  pricePerHour:{
    Type:Number,
    required:true
  },
  rating:{
    Type:String,
    required:true
  }
})