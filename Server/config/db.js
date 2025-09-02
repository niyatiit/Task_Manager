import mongoose, { mongo } from 'mongoose'

const dataBase = async (req , res) =>{
    try{
        mongoose.connection.on("connected" , () =>{
            console.log(`Database Connection Host: ${mongoose.connection.host}`)
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/TaskManager`)
    }
    catch(err){ 
        return console.log("MongoDb Database Connection Faild !!!")
    }
}

export {dataBase}