import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection:connectionObject={}

export async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Database Already connected !");
        return;
    }
    try {
        const db  = await mongoose.connect(process.env.MONGODB_URI! || "");
        connection.isConnected= db.connections[0].readyState || 1;
        console.log("Database connected successfully !");

    } catch (error:any) {
        console.log("Error while connecting database !",error.message)
        process.exit(1);
    }
}