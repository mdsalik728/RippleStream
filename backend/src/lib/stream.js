import {StreamChat} from "stream-chat";
import "dotenv/config";
const apikey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;
if(!apikey || !apiSecret){
    console.error("Stream Api key or secret is missing");

}
const streamClient=StreamChat.getInstance(apikey,apiSecret);
export const upsertStreamUser=async(userData)=>{
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error upserting Stream user",error);
    }
};

//TODO: do it later
export const generateStreamToken=(userID)=>{
    try{
        //ensure userId is string
        const userIdStr=userID.toString();
        return streamClient.createToken(userIdStr)
    }catch(error){
        console.log("error generating stream token",error.message);
        
    }
};