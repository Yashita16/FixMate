import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    Type:String , 
    required: true,
  },
  email:{
    Type: String , 
    required:true
  },
  Password:{
    type:String,
    required:true
  }

})


export default User=mongoose.model("User", userSchema)