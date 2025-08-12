import mongoose from "mongoose";

export const  connectDB =async()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URL);
       console.log("database connected on",conn.connection.host);

    } catch(error){
        console.log("error connecting to mongoDB",error);
       
        process.exit(1); //failure code is 1

    }

}
