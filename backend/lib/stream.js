import {StreamChat} from "stream-chat"

import "dotenv/config"

const apiKey =process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret)
{
    console.error("Stream API key or Secret is missing"



    )
}
 const StreamClient =StreamChat.getInstance(apiKey,apiSecret)

 export const upsertStreamUser=async (userData)=>{
    try {
        await StreamClient.upsertUsers([userData])

return userData
    } catch (error) {
        console.error("Error upserting Stream user")
        
    }
 }


 // todo:  do it later
 export const genereateStreamToken=(userId)=>{

    try {
        const userIdStr=userId.toString();
        return StreamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error generrating Stream token",error)
        
    }
 }


 